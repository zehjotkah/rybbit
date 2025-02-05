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

export function getDeviceType(ua: UAParser.IResult): string {
  if (ua.device) {
    if (ua.device.type === "mobile") {
      return "Mobile";
    } else if (ua.device.type === "tablet") {
      return "Tablet";
    } else if (ua.device.type === "console") {
      return "Console";
    } else if (ua.device.type === "smarttv") {
      return "TV";
    } else if (ua.device.type === "wearable") {
      return "Wearable";
    } else if (ua.device.type === "embedded") {
      return "Embedded";
    } else if (ua.device.type === "xr") {
      return "XR";
    }
  }

  if (ua.os.name && desktopOS.has(ua.os.name)) {
    return "Desktop";
  } else if (ua.os.name && mobileOS.has(ua.os.name)) {
    return "Mobile";
  } else if (ua.os.name && tvOS.has(ua.os.name)) {
    return "TV";
  } else if (ua.os.name && gamingOS.has(ua.os.name)) {
    return "Console";
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
