// Frogstats Analytics Script
(function () {
  // Get the script tag that loaded this script
  const scriptTag = document.currentScript;
  const ANALYTICS_HOST = scriptTag
    .getAttribute("src")
    .split("/analytics.js")[0];

  // Get debounce duration from data attribute or default to 300ms
  const debounceDuration = scriptTag.getAttribute("data-debounce")
    ? Math.max(0, parseInt(scriptTag.getAttribute("data-debounce")))
    : 500;

  // Debounce function
  function debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Track pageview (core functionality)
  const trackPageview = () => {
    const url = new URL(window.location.href);
    const payload = {
      hostname: url.hostname,
      pathname: url.pathname,
      querystring: url.search,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      language: navigator.language,
      page_title: document.title,
      referrer: document.referrer,
    };

    fetch(`${ANALYTICS_HOST}/track/pageview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      mode: "cors",
      keepalive: true,
    }).catch(console.error);
  };

  // Create debounced version with configured duration
  const debouncedTrackPageview =
    debounceDuration > 0
      ? debounce(trackPageview, debounceDuration)
      : trackPageview;

  // History API override
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    console.info("pushState");
    originalPushState.apply(this, args);
    debouncedTrackPageview();
  };

  history.replaceState = function (...args) {
    console.info("replaceState");
    originalReplaceState.apply(this, args);
    debouncedTrackPageview();
  };

  // Handle navigation events
  window.addEventListener("popstate", debouncedTrackPageview);

  // Expose API
  window.frogstats = {
    trackPageview: debouncedTrackPageview,
    // Add direct access to non-debounced version if needed
    _trackImmediately: trackPageview,
  };

  // Initial pageview
  trackPageview();
})();
