// Get browser details
export const getBrowserDetails = (userAgent: string) => {
  let browser = "Unknown";
  if (userAgent.indexOf("Chrome") > -1) {
    browser = "Chrome";
  } else if (userAgent.indexOf("Safari") > -1) {
    browser = "Safari";
  } else if (userAgent.indexOf("Firefox") > -1) {
    browser = "Firefox";
  } else if (
    userAgent.indexOf("MSIE") > -1 ||
    userAgent.indexOf("Trident/") > -1
  ) {
    browser = "Internet Explorer";
  }
  return browser;
};
