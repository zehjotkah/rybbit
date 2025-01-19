// Frogstats Analytics Script
(function () {
  // Get the script tag that loaded this script
  const scriptTag = document.currentScript;
  const ANALYTICS_URL = scriptTag.getAttribute("src").split("/analytics.js")[0];

  // Generate a unique session ID
  const generateSessionId = () => {
    const existingId = localStorage.getItem("frogstats_session_id");
    const lastActivity = localStorage.getItem("frogstats_last_activity");
    const now = Date.now();

    // Check if we have an existing session that's less than 30 minutes old
    if (
      existingId &&
      lastActivity &&
      now - parseInt(lastActivity) < 30 * 60 * 1000
    ) {
      localStorage.setItem("frogstats_last_activity", now.toString());
      return existingId;
    }

    // Generate new session ID if none exists or if expired
    const newId = Math.random().toString(36).substring(2) + now.toString(36);
    localStorage.setItem("frogstats_session_id", newId);
    localStorage.setItem("frogstats_last_activity", now.toString());
    return newId;
  };

  // Track pageview
  const trackPageview = () => {
    const url = new URL(window.location.href);
    const payload = {
      hostname: url.hostname,
      pathname: url.pathname,
      querystring: url.search,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      sessionId: generateSessionId(),
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
      sessionId: generateSessionId(),
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
      sessionId: generateSessionId(),
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
