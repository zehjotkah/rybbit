import { and, eq } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../db/postgres/postgres.js";
import { member, user } from "../../db/postgres/schema.js";
import { getSitesUserHasAccessTo } from "../../lib/auth-utils.js";

export async function getSites(req: FastifyRequest, reply: FastifyReply) {
  try {
    // Get sites the user has access to
    const sitesData = await getSitesUserHasAccessTo(req);

    // Enhance sites data with usage limit information
    const enhancedSitesData = await Promise.all(
      sitesData.map(async (site) => {
        // Skip if no organization ID
        if (!site.organizationId) {
          return { ...site, overMonthlyLimit: false };
        }

        // Get the organization owner
        const orgOwner = await db
          .select({ userId: member.userId })
          .from(member)
          .where(
            and(
              eq(member.organizationId, site.organizationId),
              eq(member.role, "owner")
            )
          )
          .limit(1);

        if (!orgOwner.length) {
          return { ...site, overMonthlyLimit: false };
        }

        // Get the user data to check if they're over limit
        const userData = await db
          .select({
            overMonthlyLimit: user.overMonthlyLimit,
            monthlyEventCount: user.monthlyEventCount,
          })
          .from(user)
          .where(eq(user.id, orgOwner[0].userId))
          .limit(1);

        if (!userData.length) {
          return { ...site, overMonthlyLimit: false };
        }

        // Return site with usage limit info
        return {
          ...site,
          overMonthlyLimit: userData[0].overMonthlyLimit || false,
          monthlyEventCount: userData[0].monthlyEventCount || 0,
        };
      })
    );

    return reply.status(200).send({ data: enhancedSitesData });
  } catch (err) {
    console.error("Error in getSites:", err);
    return reply.status(500).send({ error: String(err) });
  }
}
