const { createClient } = require("@clickhouse/client");
const crypto = require("crypto");
const { DateTime } = require("luxon");
const { faker } = require("@faker-js/faker");
require("dotenv").config();
const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const os = require("os");

const clickhouse = createClient({
  host: process.env.CLICKHOUSE_HOST,
  database: process.env.CLICKHOUSE_DB,
  password: process.env.CLICKHOUSE_PASSWORD,
});

// Command line arguments
const args = process.argv.slice(2);
const daysInPast = parseInt(args[0] || "30", 10);
const eventsPerDay = parseInt(args[1] || "5000000", 10);

console.log(
  `Generating mock data for ${daysInPast} days with approximately ${eventsPerDay} events per day`
);

// Site ID to use
const SITE_ID = 5;

// Generate 10,000 unique user IDs
const userIds = Array.from({ length: 10000 }, () => faker.string.uuid());

// Website details
const SITE_NAME = "ShopEase";
const SITE_DOMAIN = "shopease.com";

// Generate products for consistent paths
const products = Array.from({ length: 50 }, (_, index) => {
  const productId = 1000 + index;
  const name = faker.commerce.productName();
  const category = faker.commerce.department();
  const subcategory = faker.commerce.productAdjective();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return {
    id: productId,
    name,
    category,
    subcategory,
    slug,
    price: faker.commerce.price({ min: 10, max: 1000 }),
  };
});

// Generate categories
const categories = [...new Set(products.map((p) => p.category))];
const subcategories = [...new Set(products.map((p) => p.subcategory))];

// Realistic page paths with weighted distribution
const pagePaths = [
  { path: "/", weight: 20, title: `${SITE_NAME} - Online Shopping` },
  { path: "/products", weight: 15, title: `All Products - ${SITE_NAME}` },
  { path: "/categories", weight: 10, title: `Shop by Category - ${SITE_NAME}` },
  { path: "/sale", weight: 12, title: `Sale Items - ${SITE_NAME}` },
  { path: "/new-arrivals", weight: 8, title: `New Arrivals - ${SITE_NAME}` },
  { path: "/cart", weight: 7, title: `Your Shopping Cart - ${SITE_NAME}` },
  { path: "/checkout", weight: 5, title: `Checkout - ${SITE_NAME}` },
  { path: "/account", weight: 5, title: `Your Account - ${SITE_NAME}` },
  { path: "/wishlist", weight: 4, title: `Your Wishlist - ${SITE_NAME}` },
  { path: "/order-history", weight: 3, title: `Order History - ${SITE_NAME}` },
  { path: "/about", weight: 2, title: `About Us - ${SITE_NAME}` },
  { path: "/contact", weight: 2, title: `Contact Us - ${SITE_NAME}` },
  { path: "/faq", weight: 2, title: `FAQ - ${SITE_NAME}` },
  { path: "/shipping", weight: 2, title: `Shipping Policy - ${SITE_NAME}` },
  { path: "/returns", weight: 2, title: `Returns & Refunds - ${SITE_NAME}` },
];

// Add category pages
categories.forEach((category) => {
  const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  pagePaths.push({
    path: `/category/${slug}`,
    weight: 6,
    title: `${category} - ${SITE_NAME}`,
    category,
  });
});

// Add product pages (high weight as these are important for e-commerce)
products.forEach((product) => {
  pagePaths.push({
    path: `/product/${product.id}-${product.slug}`,
    weight: 9,
    title: `${product.name} - ${SITE_NAME}`,
    product,
  });
});

// Custom events with weighted distribution
const customEvents = [
  { name: "page-view", weight: 25, properties: { page: "home" } },
  { name: "product-view", weight: 20, properties: {} }, // Will be filled with product details
  { name: "add-to-cart", weight: 15, properties: {} }, // Will be filled with product details
  { name: "remove-from-cart", weight: 5, properties: {} }, // Will be filled with product details
  {
    name: "begin-checkout",
    weight: 8,
    properties: { items_count: 1, value: 0 },
  },
  { name: "checkout-step", weight: 7, properties: { step: 1, option: "" } },
  {
    name: "purchase",
    weight: 5,
    properties: { transaction_id: "", value: 0, currency: "USD", items: [] },
  },
  {
    name: "product-click",
    weight: 12,
    properties: { list_name: "recommended" },
  },
  { name: "search", weight: 10, properties: { search_term: "" } },
  {
    name: "filter-products",
    weight: 8,
    properties: { filter: "price", value: "100-200" },
  },
  { name: "add-to-wishlist", weight: 6, properties: {} }, // Will be filled with product details
  { name: "share-product", weight: 4, properties: { method: "email" } },
  {
    name: "select-promotion",
    weight: 5,
    properties: { promotion_name: "Summer Sale" },
  },
  { name: "sign-up", weight: 3, properties: { method: "email" } },
  { name: "login", weight: 6, properties: { method: "site" } },
  { name: "view-cart", weight: 10, properties: { items_count: 0, value: 0 } },
];

// Tab/query parameters for certain pages
const tabParams = {
  "/product/": [
    { param: "?variant=large", weight: 30 },
    { param: "?variant=medium", weight: 25 },
    { param: "?variant=small", weight: 20 },
    { param: "?color=blue", weight: 15 },
    { param: "?color=black", weight: 15 },
    { param: "", weight: 20 },
  ],
  "/products": [
    { param: "?sort=price-asc", weight: 25 },
    { param: "?sort=price-desc", weight: 20 },
    { param: "?sort=newest", weight: 20 },
    { param: "?sort=popular", weight: 20 },
    { param: "", weight: 15 },
  ],
  "/category/": [
    { param: "?filter=new", weight: 20 },
    { param: "?filter=sale", weight: 25 },
    { param: "?filter=in-stock", weight: 20 },
    { param: "?sort=price-low", weight: 15 },
    { param: "", weight: 20 },
  ],
};

// Referrers with weighted distribution
const referrers = [
  { url: "", weight: 30 }, // Direct
  { url: "https://www.google.com/", weight: 25 },
  { url: "https://www.facebook.com/", weight: 10 },
  { url: "https://www.instagram.com/", weight: 12 },
  { url: "https://pinterest.com/", weight: 8 },
  { url: "https://www.amazon.com/", weight: 5 },
  { url: "https://www.youtube.com/", weight: 5 },
  { url: "https://www.tiktok.com/", weight: 4 },
  { url: "https://twitter.com/", weight: 3 },
  { url: "https://www.bing.com/", weight: 3 },
  { url: "https://www.retailmenot.com/", weight: 2 },
  { url: "https://slickdeals.net/", weight: 2 },
  { url: "https://www.dealsplus.com/", weight: 1 },
  { url: `https://email.${SITE_DOMAIN}/`, weight: 10 }, // Email campaigns
  { url: "https://www.pricegrabber.com/", weight: 1 },
];

// Browsers with weighted distribution
const browsers = [
  { name: "Chrome", weight: 60, versions: ["133", "134", "135", "132"] },
  { name: "Firefox", weight: 15, versions: ["124", "123", "122"] },
  { name: "Safari", weight: 10, versions: ["17", "16", "15"] },
  { name: "Edge", weight: 8, versions: ["122", "121", "120"] },
  { name: "Opera", weight: 4, versions: ["105", "104", "103"] },
  { name: "Yandex", weight: 3, versions: ["25", "24", "23"] },
];

// Operating systems with weighted distribution
const operatingSystems = [
  { name: "Windows", weight: 65, versions: ["10", "11", "7"] },
  { name: "Android", weight: 15, versions: ["13", "12", "11", "10"] },
  { name: "iOS", weight: 10, versions: ["17", "16", "15"] },
  { name: "macOS", weight: 7, versions: ["14", "13", "12"] },
  { name: "Linux", weight: 3, versions: ["5.15", "5.10", "5.8"] },
];

// Screen resolutions with weighted distribution
const screenResolutions = [
  { width: 1920, height: 1080, weight: 30 },
  { width: 1366, height: 768, weight: 20 },
  { width: 1536, height: 864, weight: 15 },
  { width: 2560, height: 1440, weight: 10 },
  { width: 1440, height: 900, weight: 8 },
  { width: 1024, height: 768, weight: 5 },
  { width: 3840, height: 2160, weight: 5 },
  { width: 1280, height: 720, weight: 3 },
  // Mobile resolutions
  { width: 414, height: 896, weight: 3 },
  { width: 375, height: 667, weight: 3 },
  { width: 360, height: 740, weight: 3 },
  { width: 412, height: 915, weight: 2 },
  { width: 390, height: 844, weight: 2 },
  { width: 768, height: 1024, weight: 1 }, // iPad
];

// Languages with weighted distribution
const languages = [
  { code: "en-US", weight: 30 },
  { code: "en", weight: 15 },
  { code: "ru", weight: 12 },
  { code: "de", weight: 8 },
  { code: "pl", weight: 7 },
  { code: "es", weight: 6 },
  { code: "fr", weight: 6 },
  { code: "zh-CN", weight: 5 },
  { code: "it", weight: 4 },
  { code: "cs", weight: 3 },
  { code: "pt-BR", weight: 2 },
  { code: "ja", weight: 2 },
];

// Countries and regions
const geoData = [
  {
    country: "US",
    weight: 25,
    regions: [
      { code: "US-NY", weight: 20 },
      { code: "US-CA", weight: 18 },
      { code: "US-TX", weight: 15 },
      { code: "US-FL", weight: 12 },
      { code: "US-IL", weight: 10 },
      { code: "US-PA", weight: 8 },
      { code: "US-OH", weight: 7 },
      { code: "US-MI", weight: 5 },
      { code: "US-GA", weight: 5 },
    ],
  },
  {
    country: "RU",
    weight: 20,
    regions: [
      { code: "RU-MOW", weight: 25 },
      { code: "RU-SPE", weight: 15 },
      { code: "RU-KDA", weight: 10 },
      { code: "RU-KYA", weight: 10 },
      { code: "RU-NVS", weight: 8 },
      { code: "RU-SVE", weight: 8 },
      { code: "RU-IRK", weight: 5 },
      { code: "RU-YAR", weight: 5 },
    ],
  },
  {
    country: "DE",
    weight: 10,
    regions: [
      { code: "DE-BY", weight: 20 },
      { code: "DE-NW", weight: 18 },
      { code: "DE-BW", weight: 15 },
      { code: "DE-NI", weight: 12 },
      { code: "DE-HE", weight: 10 },
      { code: "DE-BE", weight: 8 },
    ],
  },
  {
    country: "PL",
    weight: 8,
    regions: [
      { code: "PL-MZ", weight: 20 },
      { code: "PL-DS", weight: 15 },
      { code: "PL-WP", weight: 15 },
      { code: "PL-SL", weight: 12 },
      { code: "PL-MA", weight: 10 },
    ],
  },
  {
    country: "GB",
    weight: 7,
    regions: [
      { code: "GB-ENG", weight: 80 },
      { code: "GB-SCT", weight: 10 },
      { code: "GB-WLS", weight: 7 },
      { code: "GB-NIR", weight: 3 },
    ],
  },
  {
    country: "FR",
    weight: 6,
    regions: [
      { code: "FR-IDF", weight: 25 },
      { code: "FR-ARA", weight: 15 },
      { code: "FR-HDF", weight: 12 },
      { code: "FR-NAQ", weight: 10 },
      { code: "FR-OCC", weight: 10 },
    ],
  },
  {
    country: "CA",
    weight: 5,
    regions: [
      { code: "CA-ON", weight: 40 },
      { code: "CA-QC", weight: 25 },
      { code: "CA-BC", weight: 15 },
      { code: "CA-AB", weight: 10 },
    ],
  },
  {
    country: "CN",
    weight: 4,
    regions: [
      { code: "CN-11", weight: 20 }, // Beijing
      { code: "CN-31", weight: 20 }, // Shanghai
      { code: "CN-44", weight: 15 }, // Guangdong
      { code: "CN-51", weight: 10 }, // Sichuan
      { code: "CN-33", weight: 10 }, // Zhejiang
      { code: "CN-32", weight: 10 }, // Jiangsu
    ],
  },
  {
    country: "AU",
    weight: 3,
    regions: [
      { code: "AU-NSW", weight: 35 },
      { code: "AU-VIC", weight: 30 },
      { code: "AU-QLD", weight: 20 },
      { code: "AU-WA", weight: 15 },
    ],
  },
  {
    country: "ES",
    weight: 3,
    regions: [
      { code: "ES-MD", weight: 25 },
      { code: "ES-CT", weight: 20 },
      { code: "ES-AN", weight: 18 },
      { code: "ES-VA", weight: 12 },
    ],
  },
  {
    country: "IT",
    weight: 2,
    regions: [
      { code: "IT-25", weight: 20 }, // Lombardy
      { code: "IT-62", weight: 15 }, // Lazio
      { code: "IT-21", weight: 15 }, // Piedmont
      { code: "IT-34", weight: 12 }, // Veneto
    ],
  },
  {
    country: "CZ",
    weight: 2,
    regions: [
      { code: "CZ-PR", weight: 35 },
      { code: "CZ-JM", weight: 20 },
      { code: "CZ-ST", weight: 15 },
    ],
  },
  {
    country: "AT",
    weight: 2,
    regions: [
      { code: "AT-9", weight: 35 }, // Vienna
      { code: "AT-6", weight: 20 }, // Styria
      { code: "AT-4", weight: 15 }, // Upper Austria
    ],
  },
  {
    country: "JP",
    weight: 2,
    regions: [
      { code: "JP-13", weight: 30 }, // Tokyo
      { code: "JP-27", weight: 15 }, // Osaka
      { code: "JP-14", weight: 10 }, // Kanagawa
    ],
  },
  {
    country: "BR",
    weight: 1,
    regions: [
      { code: "BR-SP", weight: 35 },
      { code: "BR-RJ", weight: 20 },
      { code: "BR-MG", weight: 15 },
    ],
  },
];

// Helper function to select a random item based on weights
function weightedRandom(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of items) {
    random -= item.weight;
    if (random <= 0) {
      return item;
    }
  }

  return items[0]; // Fallback
}

// Helper function to generate a UUID
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Function to generate a realistic timestamp for a given day with more traffic during peak hours
function generateTimeForDay(date) {
  // Define peak hours (in 24-hour format)
  const peakHours = [
    { hour: 9, weight: 5 }, // 9 AM
    { hour: 10, weight: 6 }, // 10 AM
    { hour: 11, weight: 7 }, // 11 AM
    { hour: 12, weight: 8 }, // 12 PM
    { hour: 13, weight: 9 }, // 1 PM
    { hour: 14, weight: 10 }, // 2 PM
    { hour: 15, weight: 10 }, // 3 PM
    { hour: 16, weight: 9 }, // 4 PM
    { hour: 17, weight: 8 }, // 5 PM
    { hour: 18, weight: 9 }, // 6 PM
    { hour: 19, weight: 10 }, // 7 PM
    { hour: 20, weight: 10 }, // 8 PM
    { hour: 21, weight: 9 }, // 9 PM
    { hour: 22, weight: 7 }, // 10 PM
    { hour: 23, weight: 5 }, // 11 PM
    { hour: 0, weight: 3 }, // 12 AM
    { hour: 1, weight: 2 }, // 1 AM
    { hour: 2, weight: 1 }, // 2 AM
    { hour: 3, weight: 1 }, // 3 AM
    { hour: 4, weight: 1 }, // 4 AM
    { hour: 5, weight: 1 }, // 5 AM
    { hour: 6, weight: 2 }, // 6 AM
    { hour: 7, weight: 3 }, // 7 AM
    { hour: 8, weight: 4 }, // 8 AM
  ];

  const hour = weightedRandom(peakHours).hour;
  const minute = Math.floor(Math.random() * 60);
  const second = Math.floor(Math.random() * 60);

  return date.set({ hour, minute, second });
}

// Helper function to format estimated time remaining
function formatETA(currentCount, targetCount, eventsPerSecond, elapsedSeconds) {
  if (eventsPerSecond <= 0 || elapsedSeconds < 1) return "calculating...";

  const remainingEvents = targetCount - currentCount;

  // Use a dynamic slowdown factor based on how far along we are
  // The more events we've generated, the more we expect slowdown
  const progress = currentCount / targetCount;
  const slowdownFactor = 1 + progress * 0.3; // Gradually add up to 30% buffer as we progress

  // Calculate seconds remaining with the slowdown factor applied
  const adjustedRate = eventsPerSecond / slowdownFactor;
  const secondsRemaining = remainingEvents / adjustedRate;

  // Format the ETA string
  if (secondsRemaining < 60) {
    return `${Math.ceil(secondsRemaining)}s`;
  } else if (secondsRemaining < 3600) {
    return `${Math.floor(secondsRemaining / 60)}m ${Math.ceil(
      secondsRemaining % 60
    )}s`;
  } else {
    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}

// Helper function to format elapsed time
function formatTime(seconds) {
  if (seconds < 60) {
    return `${Math.floor(seconds)}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
}

// Ultra-fast optimized version of the session events generation
// Focuses on performance optimizations to maximize events/second
function generateSessionEventsOptimized(
  userId,
  sessionId,
  timestamp,
  sessionData
) {
  // Pre-allocate array with maximum size for better performance (hard limit of 36 events)
  // Avoid dynamic resizing by setting reasonable upper bound
  const MAX_EVENTS = 36;
  const events = new Array(MAX_EVENTS);
  let eventCount = 0;

  // Cache user agent string - this is expensive to recreate
  const userAgent = getUserAgent(sessionData);

  // Limiting max pageviews for performance
  const maxPageviews = 6; // Reduced from 8 for higher performance

  // Get the session start time
  const sessionStartMs = timestamp.toMillis();

  // Cache common timestamps
  const timestampISO = timestamp.toISO();

  // Session duration - distributed from 1 minute to 35 minutes - simplified for performance
  // Math.pow tends to be faster than Math.random() * range distributions
  const sessionDurationMs = Math.min(
    60000 + Math.pow(Math.random(), 2) * 30 * 60000,
    35 * 60000
  );

  // Calculate session end time
  const sessionEndMs = sessionStartMs + sessionDurationMs;
  const sessionEnd = DateTime.fromMillis(sessionEndMs);

  // Get a template URL to start with
  let currentPath = "/";

  // Create a template event object with all the common fields
  // This is much faster than creating new objects for each event
  const templateEvent = {
    user_id: userId,
    session_id: sessionId,
    event_type: "", // Will be filled in
    page_path: "", // Will be filled in
    referrer: "", // Will be filled in
    timestamp: "", // Will be filled in
    querystring: "", // Will be filled in
    browser: sessionData.browser,
    browser_version: sessionData.browserVersion,
    os: sessionData.os,
    os_version: sessionData.osVersion,
    device_type: sessionData.deviceType,
    screen_resolution: `${sessionData.screenWidth}x${sessionData.screenHeight}`,
    language: sessionData.language,
    country: sessionData.country,
    region: sessionData.iso3166,
  };

  // Faster timestamp generation - use pre-cached template
  const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // Cache the user agent for all events in this session
  function getUserAgent(sessionData) {
    return `${sessionData.browser}/${sessionData.browserVersion} (${sessionData.os} ${sessionData.osVersion})`;
  }

  // Fast event creation function using the template
  // This is much faster than Object.assign or creating new objects
  function createEvent(eventType, path, referrer, timeMs, querystring = "") {
    if (eventCount >= MAX_EVENTS) return false;

    // Create date string directly instead of using DateTime
    const date = new Date(timeMs);
    const formattedTime = dateTimeFormat.format(date).replace(",", "");

    // Create event using the template - reuse as much as possible
    const event = { ...templateEvent };
    event.event_type = eventType;
    event.page_path = path;
    event.referrer = referrer;
    event.timestamp = formattedTime;
    event.querystring = querystring;

    // Store in pre-allocated array
    events[eventCount++] = event;
    return true;
  }

  // Cache frequently used JSON strings
  const cachedQueryStrings = {
    empty: "",
    utm: "utm_source=google&utm_medium=cpc&utm_campaign=spring_sale",
    search: "q=black+shoes&sort=price_asc",
    filter: "category=shoes&color=black&size=9",
    product: "variant=large&color=blue",
  };

  // Generate the page view sequence
  let prevPath = sessionData.referrer || "/";

  // Simplified session event generation
  // 1. First page view - this is always generated
  const initialTimeMs = sessionStartMs;
  const initialQuerystring =
    sessionData.referrer?.includes("google") ||
    sessionData.referrer?.includes("facebook")
      ? cachedQueryStrings.utm
      : cachedQueryStrings.empty;

  // Add the pageview event using our fast creation function
  createEvent(
    "pageview",
    currentPath,
    prevPath,
    initialTimeMs,
    initialQuerystring
  );

  // 2. Add some click events on this first page (~50% chance)
  if (Math.random() < 0.5) {
    const numClicks = (1 + Math.random() * 2) | 0;
    let clickTime = initialTimeMs + 5000;

    for (let i = 0; i < numClicks; i++) {
      clickTime += 2000 + Math.random() * 8000;
      if (clickTime >= sessionEndMs) break;

      createEvent("click", currentPath, "", clickTime, "");
    }
  }

  // 3. Generate additional page views with a simplified navigation pattern
  let currentTimeMs = initialTimeMs;
  const pageCount = Math.min(
    (1 + Math.random() * maxPageviews) | 0,
    maxPageviews
  );

  // Use a faster deterministic navigation pattern
  const navigationPatterns = [
    ["/", "/category/shoes", "/product/running-shoe-1", "/cart", "/checkout"],
    ["/", "/category/clothing", "/product/t-shirt-1", "/cart", "/checkout"],
    ["/", "/search", "/product/casual-shoe-3", "/cart", "/checkout"],
    [
      "/",
      "/category/accessories",
      "/product/watch-5",
      "/product/sunglasses-2",
      "/cart",
      "/checkout",
    ],
  ];

  // Select a pattern - reduce randomness for speed
  const patternIdx = (Math.random() * navigationPatterns.length) | 0;
  const pattern = navigationPatterns[patternIdx];
  const patternLength = Math.min(pattern.length, pageCount);

  // Follow the pattern for faster, more predictable navigation logic
  for (let i = 1; i < patternLength; i++) {
    // Update time by 10-45 seconds between page views
    currentTimeMs += 10000 + Math.random() * 35000;
    if (currentTimeMs >= sessionEndMs) break;

    // Set the path based on the pattern
    const newPath = pattern[i];

    // Get relevant querystring
    let querystring = cachedQueryStrings.empty;
    if (newPath.includes("search")) {
      querystring = cachedQueryStrings.search;
    } else if (newPath.includes("category")) {
      querystring = cachedQueryStrings.filter;
    } else if (newPath.includes("product")) {
      querystring = cachedQueryStrings.product;
    }

    // Create the page view
    createEvent("pageview", newPath, currentPath, currentTimeMs, querystring);

    // 50% chance to add click events on the page
    if (Math.random() < 0.5) {
      const numClicks = (1 + Math.random() * 2) | 0;
      let clickTime = currentTimeMs + 5000;

      for (let j = 0; j < numClicks; j++) {
        clickTime += 2000 + Math.random() * 8000;
        if (clickTime >= sessionEndMs) break;

        createEvent("click", newPath, "", clickTime, "");
      }
    }

    // Add cart events when on product pages
    if (newPath.includes("product") && Math.random() < 0.7) {
      const cartTime = currentTimeMs + 5000 + Math.random() * 15000;
      if (cartTime < sessionEndMs) {
        createEvent("add_to_cart", newPath, "", cartTime, querystring);
      }
    }

    // Add checkout events when on checkout page
    if (newPath.includes("checkout") && Math.random() < 0.8) {
      const purchaseTime = currentTimeMs + 30000 + Math.random() * 60000;
      if (purchaseTime < sessionEndMs) {
        createEvent("purchase", newPath, "", purchaseTime, "");
      }
    }

    // Update the current path for the next iteration
    currentPath = newPath;
  }

  // Return only the filled part of the array
  return eventCount < MAX_EVENTS ? events.slice(0, eventCount) : events;
}

// Function to generate session data (browser, OS, screen resolution, etc.)
function generateSessionData() {
  // Select browser and version
  const browser = weightedRandom(browsers);
  const browserVersion =
    browser.versions[Math.floor(Math.random() * browser.versions.length)];

  // Select OS and version
  const os = weightedRandom(operatingSystems);
  const osVersion = os.versions[Math.floor(Math.random() * os.versions.length)];

  // Select screen resolution
  const resolution = weightedRandom(screenResolutions);

  // Generate language code (instead of using faker.locale)
  const languageCodes = [
    "en",
    "es",
    "fr",
    "de",
    "it",
    "ru",
    "zh",
    "ja",
    "pt",
    "nl",
  ];
  const language =
    languageCodes[Math.floor(Math.random() * languageCodes.length)] +
    (Math.random() < 0.5 ? "" : "-" + faker.location.countryCode());

  // Select referrer
  const referrer = weightedRandom(referrers).url;

  // Use Faker for location data
  const country = faker.location.countryCode();
  let region = "";

  // Get region code based on country
  if (country === "US") {
    region = faker.location.state({ abbreviated: true });
  } else {
    // For non-US, we'll use a simple region code
    region = faker.location.county().slice(0, 3).toUpperCase();
  }

  // Determine device type based on screen resolution and OS
  let deviceType = "Desktop";
  if (os.name === "Android" || os.name === "iOS") {
    deviceType = "Mobile";
    if (resolution.width > 768) {
      deviceType = "Tablet";
    }
  } else if (resolution.width <= 1024) {
    deviceType = "Mobile";
  }

  return {
    browser: browser.name,
    browserVersion: browserVersion,
    os: os.name,
    osVersion: osVersion,
    screenWidth: resolution.width,
    screenHeight: resolution.height,
    language: language,
    referrer: referrer,
    country: country,
    iso3166: country && region ? `${country}-${region}` : country,
    deviceType: deviceType,
  };
}

// Function to generate events for a specific day
async function generateEventsForDay(date, targetEventsCount) {
  // Instead of one large array, use a collection of batch arrays
  const eventBatches = [];
  const BATCH_SIZE = 200000; // Doubled from 100000 for better throughput
  let currentBatch = [];

  // Active sessions map to track ongoing sessions
  const activeSessions = new Map();

  // Vary the count by ±10% to make it more realistic (reduced variation for speed)
  const variation = Math.random() * 0.2 - 0.1; // -10% to +10%
  const actualEventsCount = Math.round(targetEventsCount * (1 + variation));

  console.log(
    `Generating ${actualEventsCount.toLocaleString()} events for ${date.toFormat(
      "yyyy-MM-dd"
    )}`
  );

  // Generate sessions with higher density to reduce total session count
  const eventsPerSession = 8; // Increased from 6
  let eventCount = 0;

  const sessionsToGenerate = Math.ceil(actualEventsCount / eventsPerSession);

  console.log(
    `Preparing ${sessionsToGenerate.toLocaleString()} sessions with timestamps...`
  );

  // Pre-generate commonly used objects
  // Create them once and reuse - massive performance boost
  const CACHE_SIZE = {
    BROWSERS: 200, // Reduced from 1000
    OS: 200, // Reduced from 1000
    RESOLUTIONS: 50, // Reduced from 100
    COUNTRIES: 50, // Reduced from 100
    LANGUAGES: 50, // Reduced from 100
    REFERRERS: 50, // Reduced from 100
  };

  // Faster generation with smaller cache sizes - generate on demand
  const pregenSessionData = {
    browsers: Array(CACHE_SIZE.BROWSERS)
      .fill()
      .map(() => {
        const browser = weightedRandom(browsers);
        return {
          name: browser.name,
          version:
            browser.versions[(Math.random() * browser.versions.length) | 0],
        };
      }),

    operatingSystems: Array(CACHE_SIZE.OS)
      .fill()
      .map(() => {
        const os = weightedRandom(operatingSystems);
        return {
          name: os.name,
          version: os.versions[(Math.random() * os.versions.length) | 0],
        };
      }),

    resolutions: Array(CACHE_SIZE.RESOLUTIONS)
      .fill()
      .map(() => weightedRandom(screenResolutions)),

    referrers: Array(CACHE_SIZE.REFERRERS)
      .fill()
      .map(() => weightedRandom(referrers).url),

    countries: Array(CACHE_SIZE.COUNTRIES)
      .fill()
      .map(() => {
        const country = faker.location.countryCode();
        let region =
          country === "US"
            ? faker.location.state({ abbreviated: true })
            : faker.location.county().slice(0, 3).toUpperCase();
        return { country, region };
      }),

    languages: Array(CACHE_SIZE.LANGUAGES)
      .fill()
      .map(() => {
        const languageCodes = [
          "en",
          "es",
          "fr",
          "de",
          "it",
          "ru",
          "zh",
          "ja",
          "pt",
          "nl",
        ];
        return (
          languageCodes[(Math.random() * languageCodes.length) | 0] +
          (Math.random() < 0.5 ? "" : "-" + faker.location.countryCode())
        );
      }),
  };

  // Fast timestamp generation
  // We'll create all timestamps upfront with faster math operations
  console.log("Generating optimized timestamp distribution...");
  const dateJSDate = date.toJSDate();
  const dateObj = {
    year: date.year,
    month: date.month,
    day: date.day,
  };

  // Create a sorted array of timestamps using a faster approach
  // Primarily focusing on business hours for realistic distribution
  const allTimestamps = [];

  // Generate optimized timestamp distribution
  // Focus on business hours (8am-10pm) with peak at midday
  const HOURS_DISTRIBUTION = [
    /* 0-7 */ 0, 0, 0, 0, 0, 0, 0, 1, /* 8-15 */ 2, 3, 4, 5, 6, 6, 5, 4,
    /* 16-23 */ 3, 2, 2, 1, 1, 0, 0, 0,
  ];

  // Calculate total weight for distribution
  const TOTAL_WEIGHT = HOURS_DISTRIBUTION.reduce((a, b) => a + b, 0);

  // Generate timestamps batch using the distribution
  // This is much faster than weighted random for each timestamp
  for (let i = 0; i < sessionsToGenerate; i++) {
    // Pick an hour based on the distribution
    const r = Math.random() * TOTAL_WEIGHT;
    let hour = 0;
    let cumulativeWeight = 0;

    for (let h = 0; h < 24; h++) {
      cumulativeWeight += HOURS_DISTRIBUTION[h];
      if (r < cumulativeWeight) {
        hour = h;
        break;
      }
    }

    // Generate random minute and second
    const minute = (Math.random() * 60) | 0;
    const second = (Math.random() * 60) | 0;

    allTimestamps.push(
      DateTime.fromObject({
        ...dateObj,
        hour,
        minute,
        second,
      })
    );
  }

  // Sort timestamps for chronological order
  allTimestamps.sort((a, b) => a.toMillis() - b.toMillis());

  console.log(
    `Generated and sorted ${allTimestamps.length.toLocaleString()} timestamps.`
  );

  // For tracking progress
  const progressInterval = Math.max(Math.ceil(sessionsToGenerate / 100), 200); // Increased frequency
  const startGenerationTime = Date.now();
  let lastProgressTime = startGenerationTime;
  let lastEventCount = 0;
  const MIN_LOG_INTERVAL_MS = 1000; // Minimum 1 second between progress logs

  // For improved ETA calculation
  let recentRates = [];
  const MAX_RATES_TO_TRACK = 5; // Keep track of the last 5 generation rates

  console.log(`Beginning high-performance event generation...`);

  // Faster UUID generation using a template
  const uuidTemplate = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  const fastUUID = () => {
    return uuidTemplate.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  };

  // Cache common session data for common device types
  // Create templates for common device profiles to avoid recalculating
  const deviceProfiles = {
    desktop: {
      browser: "Chrome",
      browserVersion: "135",
      os: "Windows",
      osVersion: "10",
      screenWidth: 1920,
      screenHeight: 1080,
      deviceType: "Desktop",
    },
    mobile: {
      browser: "Chrome",
      browserVersion: "135",
      os: "Android",
      osVersion: "13",
      screenWidth: 414,
      screenHeight: 896,
      deviceType: "Mobile",
    },
    tablet: {
      browser: "Safari",
      browserVersion: "17",
      os: "iOS",
      osVersion: "17",
      screenWidth: 768,
      screenHeight: 1024,
      deviceType: "Tablet",
    },
  };

  // Process sessions in optimized batches
  // Process timestamps in batches for better memory management
  const PROCESS_BATCH_SIZE = 500; // Process 500 sessions at a time

  for (
    let batchStart = 0;
    batchStart < allTimestamps.length;
    batchStart += PROCESS_BATCH_SIZE
  ) {
    const batchEnd = Math.min(
      batchStart + PROCESS_BATCH_SIZE,
      allTimestamps.length
    );
    const timestampBatch = allTimestamps.slice(batchStart, batchEnd);

    // Process each timestamp to generate sessions and events
    for (let idx = 0; idx < timestampBatch.length; idx++) {
      const timestamp = timestampBatch[idx];
      const sessionIdx = batchStart + idx;

      // Display progress updates periodically and at most once per second
      // Check both session count and time interval
      const currentTime = Date.now();
      const timeElapsedSinceLastLog = currentTime - lastProgressTime;

      if (
        ((sessionIdx % progressInterval === 0 ||
          sessionIdx === sessionsToGenerate - 1) &&
          timeElapsedSinceLastLog >= MIN_LOG_INTERVAL_MS) ||
        (eventCount >= actualEventsCount &&
          timeElapsedSinceLastLog >= MIN_LOG_INTERVAL_MS)
      ) {
        const elapsedSeconds = (currentTime - startGenerationTime) / 1000;
        const intervalSeconds = timeElapsedSinceLastLog / 1000;

        // Calculate progress based on actual events generated
        const percentComplete = Math.min(
          ((eventCount / actualEventsCount) * 100).toFixed(1),
          100.0
        );

        // Calculate events generated in this interval
        const intervalEvents = eventCount - lastEventCount;
        const intervalRate =
          intervalSeconds > 0
            ? Math.round(intervalEvents / intervalSeconds)
            : 0;

        // Format elapsed time
        const elapsedFormatted = formatTime(elapsedSeconds);

        // Store recent rates for weighted average calculation
        if (intervalSeconds > 0 && intervalRate > 0) {
          recentRates.push(intervalRate);
          if (recentRates.length > MAX_RATES_TO_TRACK) {
            recentRates.shift(); // Remove oldest rate
          }
        }

        // Calculate weighted average rate (recent rates given more weight)
        let weightedRate = intervalRate; // Default to current rate
        if (recentRates.length > 1) {
          let totalWeight = 0;
          let weightedSum = 0;
          for (let i = 0; i < recentRates.length; i++) {
            const weight = i + 1; // More recent rates get higher weights
            weightedSum += recentRates[i] * weight;
            totalWeight += weight;
          }
          weightedRate = Math.round(weightedSum / totalWeight);
        }

        console.log(
          `Progress: ${percentComplete}% | Generated ${eventCount.toLocaleString()} of ${actualEventsCount.toLocaleString()} events ` +
            `| ${weightedRate.toLocaleString()} events/sec | Time: ${elapsedFormatted} | ETA: ${formatETA(
              eventCount,
              actualEventsCount,
              weightedRate,
              elapsedSeconds
            )}`
        );

        lastProgressTime = currentTime;
        lastEventCount = eventCount;
      }

      // Session generation with optimized logic
      const now = timestamp.toMillis();
      let sessionId, userId, sessionData;

      // Expire old sessions faster - only when we have many
      if (activeSessions.size > 200) {
        // Increased threshold
        // Only check a sample of sessions for expiration to improve performance
        const keysToCheck = Array.from(activeSessions.keys()).slice(0, 100);
        for (const sid of keysToCheck) {
          const sessionInfo = activeSessions.get(sid);
          if (now - sessionInfo.lastActivity > 30 * 60 * 1000) {
            activeSessions.delete(sid);
          }
        }
      }

      // Optimize session reuse by biasing toward recent sessions
      const shouldReuseSession = activeSessions.size > 0 && Math.random() < 0.2;

      if (shouldReuseSession) {
        // Get recent sessions (faster than scanning all)
        const activeSids = Array.from(activeSessions.keys()).slice(-30); // Get last 30 (most recent)
        sessionId = activeSids[(Math.random() * activeSids.length) | 0];
        const sessionInfo = activeSessions.get(sessionId);
        userId = sessionInfo.userId;
        sessionData = sessionInfo.data;

        // Update last activity
        sessionInfo.lastActivity = now;
      } else {
        // Create new session with optimized data generation
        sessionId = fastUUID();
        userId = userIds[(Math.random() * userIds.length) | 0];

        // Fast session data generation using device profile templates
        // Use a template 80% of the time for massive speed boost
        let template;
        const r = Math.random();
        if (r < 0.6) {
          // 60% desktop
          template = deviceProfiles.desktop;
        } else if (r < 0.9) {
          // 30% mobile
          template = deviceProfiles.mobile;
        } else {
          // 10% tablet
          template = deviceProfiles.tablet;
        }

        // Get random data from pre-generated arrays
        const browserIdx = (Math.random() * CACHE_SIZE.BROWSERS) | 0;
        const osIdx = (Math.random() * CACHE_SIZE.OS) | 0;
        const resIdx = (Math.random() * CACHE_SIZE.RESOLUTIONS) | 0;
        const countryIdx = (Math.random() * CACHE_SIZE.COUNTRIES) | 0;
        const langIdx = (Math.random() * CACHE_SIZE.LANGUAGES) | 0;
        const refIdx = (Math.random() * CACHE_SIZE.REFERRERS) | 0;

        // Apply template but override with some random values for diversity
        const { country, region } = pregenSessionData.countries[countryIdx];

        sessionData = {
          // Use template values by default
          ...template,
          // But override with some random values for diversity
          language: pregenSessionData.languages[langIdx],
          referrer: pregenSessionData.referrers[refIdx],
          country: country,
          iso3166: country && region ? `${country}-${region}` : country,
        };

        // Add to active sessions (only keep the most recent sessions to limit Map size)
        if (activeSessions.size > 2000) {
          // Limit Map size
          // Clear older sessions when we have too many
          const oldestKeys = Array.from(activeSessions.keys()).slice(0, 500);
          for (const key of oldestKeys) {
            activeSessions.delete(key);
          }
        }

        activeSessions.set(sessionId, {
          userId,
          data: sessionData,
          lastActivity: now,
        });
      }

      // Generate events for this session
      const sessionEvents = generateSessionEventsOptimized(
        userId,
        sessionId,
        timestamp,
        sessionData
      );

      // Faster batch handling - minimize array manipulation
      const newEventCount = sessionEvents.length;

      // Simplified batch handling - avoid extra operations
      if (currentBatch.length + newEventCount <= BATCH_SIZE) {
        // Fast path - append all events to current batch
        for (let i = 0; i < newEventCount; i++) {
          currentBatch.push(sessionEvents[i]);
        }
      } else {
        // Slow path - need to create a new batch
        // Add events that fit in current batch
        const spaceInCurrentBatch = BATCH_SIZE - currentBatch.length;
        for (let i = 0; i < spaceInCurrentBatch; i++) {
          currentBatch.push(sessionEvents[i]);
        }

        // Store full batch
        eventBatches.push(currentBatch);

        // Create new batch with remaining events
        currentBatch = sessionEvents.slice(spaceInCurrentBatch);
      }

      // Update event count
      eventCount += newEventCount;

      // Check if we've reached our target event count
      if (eventCount >= actualEventsCount) {
        break;
      }
    }

    // Check if we've reached our target event count
    if (eventCount >= actualEventsCount) {
      break;
    }
  }

  // Don't forget to add the last batch if it has any events
  if (currentBatch.length > 0) {
    eventBatches.push(currentBatch);
  }

  // More efficient collection of final events - avoid unnecessary slicing when possible
  const finalEvents = [];
  let remainingEvents = Math.min(eventCount, actualEventsCount);

  // Collect events from batches
  for (let i = 0; i < eventBatches.length && remainingEvents > 0; i++) {
    const batch = eventBatches[i];
    const eventsToTake = Math.min(batch.length, remainingEvents);

    if (eventsToTake === batch.length) {
      // Take the entire batch
      finalEvents.push(...batch);
    } else {
      // Take a partial batch
      finalEvents.push(...batch.slice(0, eventsToTake));
    }

    remainingEvents -= eventsToTake;
  }

  const generationEndTime = Date.now();
  const generationSeconds = (
    (generationEndTime - startGenerationTime) /
    1000
  ).toFixed(2);
  const genEventsPerSecond = Math.round(finalEvents.length / generationSeconds);

  console.log(
    `Generated ${finalEvents.length.toLocaleString()} events in ${generationSeconds} seconds ` +
      `(${genEventsPerSecond.toLocaleString()} events/sec). Starting insertion...`
  );

  // Optimize ClickHouse insertion
  const startTime = Date.now();
  let totalInserted = 0;
  let lastInsertionLogTime = Date.now();
  const MIN_INSERTION_LOG_INTERVAL_MS = 1000; // Minimum 1 second between insertion logs

  // Increase batch size even further for maximum throughput
  const INSERTION_BATCH_SIZE = 100000; // Doubled from 50000

  // Create optimized insertion batches
  const insertionBatches = [];
  for (let i = 0; i < finalEvents.length; i += INSERTION_BATCH_SIZE) {
    insertionBatches.push(
      finalEvents.slice(
        i,
        Math.min(i + INSERTION_BATCH_SIZE, finalEvents.length)
      )
    );
  }

  // Maximum number of parallel inserts - use more parallelism for faster insertion
  const MAX_PARALLEL = Math.min(4, insertionBatches.length); // Use up to 4 cores

  // Process batches with optimized parallelism
  for (let i = 0; i < insertionBatches.length; i += MAX_PARALLEL) {
    const batchPromises = [];

    // Create a set of promises for parallel execution
    for (let j = 0; j < MAX_PARALLEL && i + j < insertionBatches.length; j++) {
      const batchIndex = i + j;
      const batch = insertionBatches[batchIndex];

      batchPromises.push(
        (async () => {
          const batchStartTime = Date.now();
          try {
            await clickhouse.insert({
              table: "pageviews",
              values: batch,
              format: "JSONEachRow",
            });

            const batchEndTime = Date.now();
            const batchSeconds = (batchEndTime - batchStartTime) / 1000;
            const batchSpeed = Math.round(batch.length / batchSeconds);

            return {
              batchIndex,
              batchSize: batch.length,
              batchSpeed,
              success: true,
            };
          } catch (error) {
            console.error(`Error inserting batch ${batchIndex + 1}:`, error);
            throw error;
          }
        })()
      );
    }

    // Wait for this group of batches to complete
    try {
      const results = await Promise.all(batchPromises);

      // Update metrics
      for (const result of results) {
        if (result.success) {
          totalInserted += result.batchSize;

          const currentTime = Date.now();
          const totalElapsed = (currentTime - startTime) / 1000;
          const averageSpeed = Math.round(totalInserted / totalElapsed);

          // Only log if at least 1 second has passed since the last log
          if (
            currentTime - lastInsertionLogTime >=
            MIN_INSERTION_LOG_INTERVAL_MS
          ) {
            console.log(
              `Inserted batch ${result.batchIndex + 1} of ${
                insertionBatches.length
              } | ` +
                `Batch speed: ${result.batchSpeed.toLocaleString()} events/sec | ` +
                `Avg speed: ${averageSpeed.toLocaleString()} events/sec`
            );
            lastInsertionLogTime = currentTime;
          }
        }
      }
    } catch (error) {
      console.error("Error in batch processing:", error);
      throw error;
    }
  }

  const endTime = Date.now();
  const totalSeconds = (endTime - startTime) / 1000;
  const overallSpeed = Math.round(finalEvents.length / totalSeconds);

  console.log(
    `Day completed in ${totalSeconds.toFixed(2)} seconds | ` +
      `Overall insertion speed: ${overallSpeed.toLocaleString()} events/sec | ` +
      `CPU cores utilized: ${MAX_PARALLEL} of 4`
  );

  return finalEvents.length;
}

// Main function that runs the data generation process
async function main() {
  console.log(
    `Starting mock data generation with Worker Threads optimization...`
  );
  console.log(`CPU cores available: ${os.cpus().length}`);

  // Parse command line arguments
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error(
      "Usage: node index.js <number_of_days> <target_events_per_day> [start_date]"
    );
    process.exit(1);
  }

  const numberOfDays = parseInt(args[0]);
  const targetEventsPerDay = parseInt(args[1]);
  let startDate = args[2]
    ? DateTime.fromISO(args[2])
    : DateTime.now().minus({ days: numberOfDays });

  // Ensure valid input
  if (isNaN(numberOfDays) || isNaN(targetEventsPerDay)) {
    console.error("Number of days and events per day must be numbers");
    process.exit(1);
  }

  // Initialize ClickHouse client
  initClickhouse();

  // Create the events table if it doesn't exist
  await clickhouse.query(createTableQuery).toPromise();

  // Generate fake user IDs if needed
  generateFakeUserIds();

  // Track total events generated across all days
  let totalEvents = 0;
  const startTime = Date.now();

  // Calculate how many worker threads to use - leave 1 core for the main thread
  const MAX_WORKERS = Math.max(1, os.cpus().length - 1);
  console.log(`Using ${MAX_WORKERS} worker threads for parallel processing`);

  // Process days in parallel with worker threads if we have multiple days
  if (numberOfDays > 1 && MAX_WORKERS > 1) {
    // Process in batches to avoid creating too many workers at once
    const BATCH_SIZE = MAX_WORKERS;

    for (let i = 0; i < numberOfDays; i += BATCH_SIZE) {
      const dayBatchPromises = [];

      // Create workers for this batch
      for (let j = 0; j < BATCH_SIZE && i + j < numberOfDays; j++) {
        const dayIndex = i + j;
        const dayDate = startDate.plus({ days: dayIndex });

        // Create a promise for this day's worker
        dayBatchPromises.push(
          new Promise((resolve, reject) => {
            // Create worker thread for this day
            const worker = new Worker(__filename, {
              workerData: {
                date: dayDate.toISO(),
                targetEventsCount: targetEventsPerDay,
                dayIndex: dayIndex + 1,
                totalDays: numberOfDays,
              },
            });

            // Handle messages from worker
            worker.on("message", (message) => {
              if (message.type === "progress") {
                // Log progress message from worker
                console.log(
                  `Day ${dayIndex + 1}/${numberOfDays}: ${message.data}`
                );
              } else if (message.type === "result") {
                // Day completed
                resolve(message.eventCount);
              }
            });

            // Handle worker errors
            worker.on("error", reject);
            worker.on("exit", (code) => {
              if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
              }
            });
          })
        );
      }

      // Wait for all workers in this batch to complete
      try {
        const dayResults = await Promise.all(dayBatchPromises);
        totalEvents += dayResults.reduce((sum, count) => sum + count, 0);
      } catch (error) {
        console.error("Error in worker batch:", error);
        process.exit(1);
      }
    }
  } else {
    // Process days sequentially if we only have one day or limited cores
    for (let i = 0; i < numberOfDays; i++) {
      const dayDate = startDate.plus({ days: i });
      console.log(
        `Processing day ${i + 1}/${numberOfDays}: ${dayDate.toFormat(
          "yyyy-MM-dd"
        )}`
      );

      try {
        const eventsGenerated = await generateEventsForDay(
          dayDate,
          targetEventsPerDay
        );
        totalEvents += eventsGenerated;

        console.log(
          `Completed day ${
            i + 1
          }/${numberOfDays} with ${eventsGenerated.toLocaleString()} events. ` +
            `Total: ${totalEvents.toLocaleString()} events`
        );
      } catch (error) {
        console.error(
          `Error generating events for ${dayDate.toFormat("yyyy-MM-dd")}:`,
          error
        );
        process.exit(1);
      }
    }
  }

  const endTime = Date.now();
  const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
  const eventsPerSecond = Math.round(totalEvents / parseFloat(totalSeconds));

  console.log(
    `\nGeneration complete!\n` +
      `Total events: ${totalEvents.toLocaleString()}\n` +
      `Time taken: ${formatTime(parseFloat(totalSeconds))}\n` +
      `Overall speed: ${eventsPerSecond.toLocaleString()} events/sec\n` +
      `Parallel processing: ${MAX_WORKERS} workers\n`
  );

  process.exit(0);
}

// When running as a worker thread
if (!isMainThread) {
  // Extract data passed to the worker
  const { date, targetEventsCount, dayIndex, totalDays } = workerData;

  // Initialize required components
  initClickhouse();
  generateFakeUserIds();

  // Convert ISO date string back to DateTime
  const dayDate = DateTime.fromISO(date);

  // Process the day
  (async () => {
    try {
      console.log(
        `Worker started for day ${dayIndex}/${totalDays}: ${dayDate.toFormat(
          "yyyy-MM-dd"
        )}`
      );

      // Override console.log to send progress messages to main thread
      const originalConsoleLog = console.log;
      let lastProgressSentTime = Date.now();
      const MIN_PROGRESS_INTERVAL_MS = 1000; // Minimum 1 second between progress messages

      console.log = (message) => {
        if (
          typeof message === "string" &&
          (message.includes("Progress:") ||
            message.includes("Generated") ||
            message.includes("Inserted batch"))
        ) {
          const currentTime = Date.now();
          // Only send progress messages at most once per second
          if (
            message.includes("Progress:") &&
            currentTime - lastProgressSentTime < MIN_PROGRESS_INTERVAL_MS
          ) {
            // Skip this progress message due to throttling
            return;
          }

          parentPort.postMessage({
            type: "progress",
            data: message,
          });

          if (message.includes("Progress:")) {
            lastProgressSentTime = currentTime;
          }
        } else {
          originalConsoleLog(message);
        }
      };

      // Generate events for this day
      const eventsGenerated = await generateEventsForDay(
        dayDate,
        targetEventsCount
      );

      // Send result back to main thread
      parentPort.postMessage({
        type: "result",
        eventCount: eventsGenerated,
        day: dayIndex,
      });
    } catch (error) {
      console.error(`Worker error for day ${dayIndex}:`, error);
      process.exit(1);
    }
  })();
} else {
  // Run main function when this is the main thread
  main().catch(console.error);
}
