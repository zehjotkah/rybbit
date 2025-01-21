import { FastifyRequest } from "fastify";
import crypto from "crypto";

export function generateUserId(ip: string, userAgent: string) {
  return crypto
    .createHash("sha256")
    .update(ip + userAgent)
    .digest("hex");
}

export function getDeviceType(
  screenWidth: number,
  screenHeight: number
): string {
  if (screenWidth < 768) {
    return "Mobile";
  } else if (screenWidth >= 768 && screenWidth < 1024) {
    return "Tablet";
  } else {
    return "Desktop";
  }
}

// Helper function to get IP address
export const getIpAddress = (request: FastifyRequest): string => {
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
