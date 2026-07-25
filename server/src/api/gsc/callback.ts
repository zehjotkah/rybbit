import { FastifyReply, FastifyRequest } from "fastify";
import { GSCCallbackRequest } from "./types.js";
import { gscConnections } from "../../db/postgres/schema.js";
import { eq } from "drizzle-orm";
import { getGSCProperties, verifyGSCState } from "./utils.js";
import { getSessionFromReq, getUserHasAdminAccessToSite } from "../../lib/auth-utils.js";
import { db } from "../../db/postgres/postgres.js";
import { logger } from "../../lib/logger/logger.js";
import { getOriginFromRequest } from "../../lib/request-utils.js";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

/**
 * Handles the OAuth callback from Google
 * Exchanges the code for tokens and stores them in the database
 */
export async function gscCallback(req: FastifyRequest<GSCCallbackRequest>, res: FastifyReply) {
  try {
    const { code, state, error } = req.query;
    
    // Verify the signed state up front: it is the only trustworthy source of the
    // target siteId and the initiating frontend origin (the OAuth callback arrives
    // via Google's redirect, so request headers can't reveal the original domain).
    // A tampered/forged/expired state yields null. Origin falls back to the request
    // (then BASE_URL) so error redirects still work when state is missing/invalid.
    const statePayload = state ? verifyGSCState(state) : null;
    const origin = statePayload?.origin || getOriginFromRequest(req);

    logger.info(`GSC callback received - origin: ${origin}, hasCode: ${!!code}, error: ${error}`);

    if (error) {
      logger.info(`OAuth cancelled or failed: ${error}`);
      return res.redirect(`${origin}/`);
    }

    if (!code || !state) {
      return res.status(400).send({ error: "Missing code or state parameter" });
    }

    if (!statePayload) {
      return res.status(400).send({ error: "Invalid or expired state parameter" });
    }
    const { siteId } = statePayload;

    // Get session to retrieve userId
    const session = await getSessionFromReq(req);
    if (!session) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    // The session completing the callback must be the same user that initiated
    // the flow (defends against connection fixation / cross-user state reuse).
    if (session.user.id !== statePayload.userId) {
      return res.status(403).send({ error: "State does not match session" });
    }

    // Verify the caller actually has admin access to the target site before
    // writing OAuth tokens against it (prevents IDOR / connection hijack).
    const hasAccess = await getUserHasAdminAccessToSite(req, siteId);
    if (!hasAccess) {
      return res.status(403).send({ error: "Access denied" });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.SERVER_URL}/api/gsc/callback`;

    if (!clientId || !clientSecret) {
      return res.status(500).send({ error: "Google OAuth not configured" });
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      logger.error(`Token exchange failed: ${await tokenResponse.text()}`);
      return res.redirect(`${origin}/error?message=Token exchange failed`);
    }

    const tokens: TokenResponse = await tokenResponse.json();

    // Get available GSC properties
    const properties = await getGSCProperties(tokens.access_token, req.log);

    if (properties.length === 0) {
      return res.redirect(`${origin}/error?message=No GSC properties found`);
    }

    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    // Store tokens temporarily WITHOUT a property URL
    // We'll update with the selected property after user chooses
    const [existingConnection] = await db.select().from(gscConnections).where(eq(gscConnections.siteId, siteId));

    if (existingConnection) {
      // Update existing connection with new tokens (but keep old property if it exists)
      await db
        .update(gscConnections)
        .set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt: expiresAt.toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(gscConnections.siteId, siteId));
    } else {
      // Create new connection with temporary placeholder
      await db.insert(gscConnections).values({
        siteId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: expiresAt.toISOString(),
        gscPropertyUrl: "PENDING_SELECTION", // Placeholder until user selects
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Redirect to property selection page with properties as query params
    const propertiesParam = encodeURIComponent(JSON.stringify(properties));
    return res.redirect(`${origin}/${siteId}/gsc/select-property?properties=${propertiesParam}`);
  } catch (error) {
    logger.error(error, "Error handling GSC callback");
    // Get origin for error redirect (may not be available in catch block)
    const origin = getOriginFromRequest(req);
    return res.redirect(`${origin}/error?message=Callback failed`);
  }
}
