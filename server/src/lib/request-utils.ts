import { FastifyRequest } from "fastify";

/**
 * Extract the origin (protocol + hostname + port) from a Fastify request.
 * This supports multi-domain deployments by detecting the actual domain
 * the user is accessing from, rather than relying on a static BASE_URL.
 *
 * Priority order:
 * 1. Origin header (most reliable for CORS requests)
 * 2. Referer header (fallback for navigation)
 * 3. X-Forwarded-Host + X-Forwarded-Proto (for reverse proxies)
 * 4. Host header + protocol detection
 * 5. BASE_URL environment variable (fallback)
 *
 * @param request - Fastify request object
 * @returns The origin URL (e.g., "https://analytics.example.com")
 */
export function getOriginFromRequest(request: FastifyRequest): string {
  // Try origin header first (most reliable)
  const origin = request.headers.origin;
  if (origin) {
    return origin;
  }

  // Try referer header
  const referer = request.headers.referer || request.headers.referrer;
  if (referer) {
    try {
      // Handle array case (take first value)
      const refererStr = Array.isArray(referer) ? referer[0] : referer;
      const url = new URL(refererStr);
      return url.origin;
    } catch {
      // Invalid URL, continue to next method
    }
  }

  // Try X-Forwarded headers (common with reverse proxies)
  const forwardedHost = request.headers["x-forwarded-host"];
  const forwardedProto = request.headers["x-forwarded-proto"];
  if (forwardedHost && forwardedProto) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  // Try host header with protocol detection
  const host = request.headers.host;
  if (host) {
    // Detect protocol from X-Forwarded-Proto or assume https in production
    const proto = forwardedProto || (request.protocol === "https" ? "https" : "http");
    return `${proto}://${host}`;
  }

  // Fallback to BASE_URL environment variable
  return process.env.BASE_URL || "http://localhost:3001";
}
