// Frogstats Analytics Script
(function () {
  // Get the script tag that loaded this script
  const scriptTag = document.currentScript;
  const ANALYTICS_URL = scriptTag.getAttribute("src").split("/analytics.js")[0];

  // Track pageview
  const trackPageview = () => {
    const url = new URL(window.location.href);
    const payload = {
      hostname: url.hostname,
      pathname: url.pathname,
      querystring: url.search,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      language: navigator.language,
    };

    fetch(`${ANALYTICS_URL}/track/pageview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      mode: "cors",
      keepalive: true,
    }).catch(console.error);
  };

  // Track custom events
  const trackEvent = (eventName, eventData = {}) => {
    const payload = {
      eventName,
      eventData,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    fetch(`${ANALYTICS_URL}/track/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      mode: "cors",
      keepalive: true,
    }).catch(console.error);
  };

  // Track page duration
  let pageLoadTime = Date.now();
  window.addEventListener("beforeunload", () => {
    const duration = Math.floor((Date.now() - pageLoadTime) / 1000);
    const payload = {
      url: window.location.href,
      timestamp: new Date().toISOString(),
      duration,
    };

    // Using sendBeacon for more reliable data sending on page unload
    // navigator.sendBeacon(
    //   `${ANALYTICS_URL}/track/pageview`,
    //   JSON.stringify(payload)
    // );
  });

  // Expose the tracking functions globally
  window.frogstats = {
    trackEvent,
    trackPageview,
  };

  // Track initial pageview
  trackPageview();
})();
