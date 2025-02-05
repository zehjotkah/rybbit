import { FastifyRequest } from "fastify";
import crypto from "crypto";

export function getUserId(ip: string, userAgent: string) {
  return crypto
    .createHash("sha256")
    .update(ip + userAgent)
    .digest("hex");
}

export const desktopOS = new Set([
  "Windows",
  "macOS",
  "Linux",
  "Ubuntu",
  "Fedora",
  "Debian",
  "Mint",
  "Arch",
  "CentOS",
  "elementary OS",
  "Gentoo",
  "Kubuntu",
  "Manjaro",
  "RedHat",
  "SUSE",
  "Slackware",
  "Deepin",
  "FreeBSD",
  "OpenBSD",
  "NetBSD",
  "GhostBSD",
  "PC-BSD",
  "Solaris",
  "AIX",
  "HP-UX",
  "OS/2",
  "BeOS",
  "Haiku",
  "Amiga OS",
  "Morph OS",
  "SerenityOS",
]);

export const mobileOS = new Set([
  "iOS",
  "Android",
  "Windows Phone",
  "Windows Mobile",
  "BlackBerry",
  "Symbian",
  "Firefox OS",
  "Ubuntu Touch",
  "Sailfish",
  "Tizen",
  "KaiOS",
  "HarmonyOS",
  "OpenHarmony",
  "watchOS",
  "Android-x86",
  "RIM Tablet OS",
  "Bada",
  "WebOS",
  "Maemo",
  "MeeGo",
]);

export const tvOS = new Set([
  "Chromecast",
  "Chromecast Android",
  "Chromecast Fuchsia",
  "Chromecast Linux",
  "Chromecast SmartSpeaker",
  "NetTV",
  "NetRange",
]);

export const gamingOS = new Set(["PlayStation", "Xbox", "Nintendo"]);

export const otherOS = new Set([
  "Fuchsia",
  "GNU",
  "Hurd",
  "Plan9",
  "Contiki",
  "Pico",
  "Minix",
  "Unix",
  "OpenVMS",
  "RISC OS",
  "QNX",
  "Series40",
  "PCLinuxOS",
  "Linpus",
  "Linspire",
  "Mageia",
  "Mandriva",
  "Raspbian",
  "Sabayon",
  "VectorLinux",
  "Zenwalk",
  "DragonFly",
]);

export function getDeviceType(
  screenWidth: number,
  screenHeight: number,
  os = ""
): string {
  if (desktopOS.has(os)) {
    return "Desktop";
  } else if (mobileOS.has(os)) {
    return "Mobile";
  } else if (tvOS.has(os)) {
    return "TV";
  } else if (gamingOS.has(os)) {
    return "Gaming";
  } else {
    return "Other";
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
