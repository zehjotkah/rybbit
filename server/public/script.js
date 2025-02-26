// Frogstats Analytics Script
(function () {
  // Get the script tag that loaded this script
  const scriptTag = document.currentScript;
  const ANALYTICS_HOST = scriptTag.getAttribute("src").split("/script.js")[0];

  if (!ANALYTICS_HOST) {
    console.error("Please provide a valid analytics host");
    return;
  }

  const SITE_ID = scriptTag.getAttribute("site-id");

  if (!SITE_ID || isNaN(Number(SITE_ID))) {
    console.error("Please provide a valid site ID");
    return;
  }

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
      site_id: SITE_ID,
      hostname: url.hostname,
      pathname: url.pathname,
      querystring: url.search,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      language: navigator.language,
      page_title: document.title,
      referrer: document.referrer,
    };

    console.log(payload);

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
    originalPushState.apply(this, args);
    debouncedTrackPageview();
  };

  history.replaceState = function (...args) {
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
