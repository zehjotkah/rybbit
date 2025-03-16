// Frogstats Analytics Script
(function () {
  // Get the script tag that loaded this script
  const scriptTag = document.currentScript;
  const ANALYTICS_HOST = scriptTag.getAttribute("src").split("/script.js")[0];

  if (!ANALYTICS_HOST) {
    console.error("Please provide a valid analytics host");
    return;
  }

  const SITE_ID =
    scriptTag.getAttribute("data-site-id") || scriptTag.getAttribute("site-id");

  if (!SITE_ID || isNaN(Number(SITE_ID))) {
    console.error(
      "Please provide a valid site ID using the data-site-id attribute"
    );
    return;
  }

  // Get debounce duration from data attribute or default to 500ms
  const debounceDuration = scriptTag.getAttribute("data-debounce")
    ? Math.max(0, parseInt(scriptTag.getAttribute("data-debounce")))
    : 500;

  // Check if automatic URL tracking should be disabled
  const autoTrackURLs = scriptTag.getAttribute("data-auto-track") !== "false";

  // Debounce function
  function debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Unified tracking function for all event types
  const track = (eventType = "pageview", eventName = "", properties = {}) => {
    // Validate event data
    if (
      eventType === "custom_event" &&
      (!eventName || typeof eventName !== "string")
    ) {
      console.error(
        "Event name is required and must be a string for custom events"
      );
      return;
    }

    const url = new URL(window.location.href);
    const payload = {
      site_id: SITE_ID,
      hostname: url.hostname,
      pathname: url.pathname,
      querystring: url.search,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      language: navigator.language,
      page_title: document.title,
      referrer: document.referrer,
      type: eventType,
      event_name: eventName,
      properties:
        eventType === "custom_event" ? JSON.stringify(properties) : undefined,
    };

    console.log(`${eventType} event:`, payload);

    // Use the new unified endpoint
    fetch(`${ANALYTICS_HOST}/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      mode: "cors",
      keepalive: true,
    }).catch(console.error);
  };

  // Helper function for pageviews
  const trackPageview = () => track("pageview");

  // Create debounced version with configured duration
  const debouncedTrackPageview =
    debounceDuration > 0
      ? debounce(trackPageview, debounceDuration)
      : trackPageview;

  // Only set up automatic URL change tracking if not disabled
  if (autoTrackURLs) {
    // History API override
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      debouncedTrackPageview();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      debouncedTrackPageview();
    };

    // Handle navigation events
    window.addEventListener("popstate", debouncedTrackPageview);
  }

  // Expose API
  window.frogstats = {
    // Core tracking function
    track,
    // Helper functions for backward compatibility and convenience
    pageview: trackPageview,
    event: (name, properties = {}) => track("custom_event", name, properties),
  };

  // Initial pageview
  trackPageview();
})();
