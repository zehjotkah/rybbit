import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import { FastifyRequest } from "fastify";
import UAParser, { UAParser as userAgentParser } from "ua-parser-js";
import { z } from "zod";
import { sitesOverLimit } from "../cron/monthly-usage-checker.js";
import { db } from "../db/postgres/postgres.js";
import { activeSessions } from "../db/postgres/schema.js";
import { TrackingPayload } from "../types.js";
import { trackingPayloadSchema } from "./trackEvent.js";

// Define extended payload types
export type BaseTrackingPayload = TrackingPayload & {
  type?: string;
  event_name?: string;
  properties?: string;
};

export type TotalTrackingPayload = BaseTrackingPayload & {
  userId: string;
  timestamp: string;
  sessionId: string;
  ua: UAParser.IResult;
  referrer: string;
  ipAddress: string;
};

// Infer type from Zod schema
export type ValidatedTrackingPayload = z.infer<typeof trackingPayloadSchema>;

// UTM and URL parameter parsing utilities
export function getUTMParams(querystring: string): Record<string, string> {
  const params: Record<string, string> = {};

  if (!querystring) return params;

  try {
    const searchParams = new URLSearchParams(querystring);

    // Extract UTM parameters
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith("utm_") || key === "gclid" || key === "gad_source") {
        params[key.toLowerCase()] = value.toLowerCase();
      }
    }
  } catch (e) {
    console.error("Error parsing query string:", e);
  }

  return params;
}

// Clear referrer if it's from the same domain
export function clearSelfReferrer(referrer: string, hostname: string): string {
  if (!referrer || !hostname) return referrer;

  try {
    const referrerUrl = new URL(referrer);
    if (referrerUrl.hostname === hostname) {
      // Internal navigation, clear the referrer
      return "";
    }
  } catch (e) {
    // Invalid URL, return original referrer
  }

  return referrer;
}

// Check if site is over the monthly limit
export function isSiteOverLimit(siteId: number | string): boolean {
  return sitesOverLimit.has(Number(siteId));
}

// Get existing user session
export async function getExistingSession(userId: string, siteId: string) {
  const siteIdNumber = parseInt(siteId, 10); // Ensure siteId is a number for the query

  const [existingSession] = await db
    .select()
    .from(activeSessions)
    .where(
      and(
        eq(activeSessions.userId, userId),
        eq(activeSessions.siteId, siteIdNumber)
      )
    )
    .limit(1);

  return existingSession || null; // Return the session or null if not found
}

// Create base tracking payload from request
export function createBasePayload(
  request: FastifyRequest,
  eventType: "pageview" | "custom_event" = "pageview",
  validatedBody: ValidatedTrackingPayload
): TotalTrackingPayload {
  const userAgent = request.headers["user-agent"] || "";
  const ipAddress = getIpAddress(request);
  const userId = getUserId(ipAddress, userAgent);

  return {
    ...validatedBody,
    hostname: validatedBody.hostname || "",
    pathname: validatedBody.pathname || "",
    querystring: validatedBody.querystring || "",
    screenWidth: validatedBody.screenWidth || 0,
    screenHeight: validatedBody.screenHeight || 0,
    language: validatedBody.language || "",
    page_title: validatedBody.page_title || "",
    referrer: validatedBody.referrer || "",
    type: eventType,
    ipAddress: ipAddress,
    timestamp: new Date().toISOString(),
    ua: userAgentParser(userAgent),
    userId: userId,
    sessionId: crypto.randomUUID(), // Will be replaced if session exists
  };
}

function getUserId(ip: string, userAgent: string) {
  return crypto
    .createHash("sha256")
    .update(ip + userAgent)
    .digest("hex");
}

// Helper function to get IP address
const getIpAddress = (request: FastifyRequest): string => {
  // Check for proxied IP addresses
  const forwardedFor = request.headers["x-forwarded-for"];
  if (forwardedFor && typeof forwardedFor === "string") {
    return forwardedFor.split(",")[0].trim();
  }

  // Check for Cloudflare
  const cfConnectingIp = request.headers["cf-connecting-ip"];
  if (cfConnectingIp && typeof cfConnectingIp === "string") {
    return cfConnectingIp;
  }

  // Fallback to direct IP
  return request.ip;
};
