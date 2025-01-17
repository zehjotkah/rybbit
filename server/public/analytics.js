// Frogstats Analytics Script
(function () {
  const ANALYTICS_URL = "http://localhost:3001"; // Replace with your actual analytics server URL

  // Generate a unique session ID
  const generateSessionId = () => {
    const existingId = localStorage.getItem("frogstats_session_id");
    if (existingId) return existingId;

    const newId =
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("frogstats_session_id", newId);
    return newId;
  };

  // Track pageview
  const trackPageview = () => {
    const payload = {
      url: window.location.href,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      sessionId: generateSessionId(),
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
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
    navigator.sendBeacon(
      `${ANALYTICS_URL}/track/pageview`,
      JSON.stringify(payload)
    );
  });

  // Expose the tracking functions globally
  window.frogstats = {
    trackEvent,
    trackPageview,
  };

  // Track initial pageview
  trackPageview();
})();
