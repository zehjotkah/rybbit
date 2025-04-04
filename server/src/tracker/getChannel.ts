import {
  affiliateMediums,
  audioMediums,
  displayMediums,
  emailMediums,
  emailSources,
  pushMediums,
  referralMediums,
  searchDomains,
  searchSources,
  shoppingDomains,
  shoppingSources,
  smsSources,
  socialDomains,
  socialMediums,
  socialSources,
  videoDomains,
  videoMediums,
  videoSources,
} from "./const.js";

// UTM and URL parameter parsing utilities
function getUTMParams(querystring: string): Record<string, string> {
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

function getDomainFromReferrer(referrer: string): string {
  if (!referrer) return "$direct";

  try {
    const url = new URL(referrer);
    return url.hostname;
  } catch (e) {
    // Handle invalid URLs
    return "$direct";
  }
}

// Checks if the referrer is from the same site as the current hostname
function isSelfReferral(referringDomain: string, hostname: string): boolean {
  if (!referringDomain || !hostname) return false;
  return referringDomain === hostname;
}

export function getChannel(
  referrer: string,
  querystring: string,
  hostname?: string
): string {
  const utmParams = getUTMParams(querystring);
  const referringDomain = getDomainFromReferrer(referrer);

  // Check if this is a self-referral (internal navigation)
  const selfReferral = hostname
    ? isSelfReferral(referringDomain, hostname)
    : false;

  // UTM parameters
  const utmSource = utmParams["utm_source"] || "";
  const utmMedium = utmParams["utm_medium"] || "";
  const utmCampaign = utmParams["utm_campaign"] || "";
  const gclid = utmParams["gclid"] || "";
  const gadSource = utmParams["gad_source"] || "";

  // If it's a self-referral and has no UTM parameters, treat it as internal traffic
  if (
    (selfReferral || !referrer) &&
    !utmSource &&
    !utmMedium &&
    !utmCampaign &&
    !gclid &&
    !gadSource
  ) {
    return "Internal";
  }

  // Check if traffic is paid
  const isPaid =
    ["cpc", "cpm", "cpv", "cpa", "ppc", "retargeting"].includes(utmMedium) ||
    utmMedium.startsWith("paid") ||
    gclid !== "" ||
    gadSource !== "";

  // Check domain type - improved to handle subdomains better
  const isDomainSearch = searchDomains.some(
    (domain) =>
      referringDomain.includes(domain) ||
      /^(?:www\.)?google\.[a-z]{2,3}$/.test(referringDomain)
  );
  const isDomainSocial = socialDomains.some((domain) =>
    referringDomain.includes(domain)
  );
  const isDomainVideo = videoDomains.some((domain) =>
    referringDomain.includes(domain)
  );
  const isDomainShopping = shoppingDomains.some((domain) =>
    referringDomain.includes(domain)
  );

  // Check source type
  const isSourceSearch = searchSources.includes(utmSource);
  const isSourceSocial = socialSources.includes(utmSource);
  const isSourceVideo = videoSources.includes(utmSource);
  const isSourceShopping = shoppingSources.includes(utmSource);
  const isSourceEmail = emailSources.includes(utmSource);
  const isSourceSMS = smsSources.includes(utmSource);

  // Apply channel detection logic (in order of precedence)

  // Cross Network
  if (utmCampaign === "cross-network") return "Cross-Network";

  // Paid channels
  if (isPaid) {
    if (isSourceSearch || isDomainSearch) return "Paid Search";
    if (isSourceSocial || isDomainSocial) return "Paid Social";
    if (isSourceVideo || isDomainVideo) return "Paid Video";
    if (isSourceShopping || isDomainShopping) return "Paid Shopping";
    if (socialMediums.includes(utmMedium)) return "Paid Social";
    if (videoMediums.includes(utmMedium)) return "Paid Video";
    if (displayMediums.includes(utmMedium)) return "Display";
    if (gadSource === "1") return "Paid Search";
    if (/video/.test(utmCampaign)) return "Paid Video";
    return "Paid Unknown";
  }

  // Direct
  if (
    (referringDomain === "$direct" || (!referrer && !selfReferral)) &&
    !utmMedium &&
    (!utmSource || utmSource === "direct" || utmSource === "(direct)")
  ) {
    return "Direct";
  }

  // Organic channels - with referrer domain check prioritized for more accurate detection
  // This is the key part that handles organic search from Google clicks without UTM params
  if (isDomainSearch) return "Organic Search";
  if (isDomainSocial) return "Organic Social";
  if (isDomainVideo) return "Organic Video";
  if (isDomainShopping) return "Organic Shopping";

  // Then check UTM parameters if referrer didn't match
  if (isSourceSearch) return "Organic Search";
  if (isSourceSocial) return "Organic Social";
  if (isSourceVideo) return "Organic Video";
  if (isSourceShopping) return "Organic Shopping";
  if (isSourceEmail || emailMediums.includes(utmMedium)) return "Email";
  if (isSourceSMS) return "SMS";

  // Medium-based detection
  if (socialMediums.includes(utmMedium)) return "Organic Social";
  if (videoMediums.includes(utmMedium)) return "Organic Video";
  if (affiliateMediums.includes(utmMedium)) return "Affiliate";
  if (referralMediums.includes(utmMedium)) return "Referral";
  if (displayMediums.includes(utmMedium)) return "Display";
  if (audioMediums.includes(utmMedium)) return "Audio";
  if (pushMediums.includes(utmMedium) || utmMedium.endsWith("push"))
    return "Push";

  // Campaign-based detection
  if (/video/.test(utmCampaign)) return "Organic Video";
  if (/shop|shopping/.test(utmCampaign)) return "Organic Shopping";

  // If referring domain exists but we couldn't categorize it
  // Don't mark as referral if it's a self-referral
  if (referringDomain && referringDomain !== "$direct" && !selfReferral)
    return "Referral";

  // Default fallback
  return "Unknown";
}
