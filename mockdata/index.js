const { createClient } = require("@clickhouse/client");
const crypto = require("crypto");
const { DateTime } = require("luxon");
const { faker } = require("@faker-js/faker");
require("dotenv").config();

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

// Function to generate events for a specific day
async function generateEventsForDay(date, targetEventsCount) {
  // Instead of one large array, use a collection of batch arrays
  const eventBatches = [];
  const BATCH_SIZE = 100000; // Store events in manageable chunks
  let currentBatch = [];

  // Active sessions map to track ongoing sessions
  const activeSessions = new Map();

  // Vary the count by ±15% to make it more realistic
  const variation = Math.random() * 0.3 - 0.15; // -15% to +15%
  const actualEventsCount = Math.round(targetEventsCount * (1 + variation));

  console.log(
    `Generating ${actualEventsCount.toLocaleString()} events for ${date.toFormat(
      "yyyy-MM-dd"
    )}`
  );

  // Generate 4-10x more events than sessions (averaging 5-6 events per session)
  const eventsPerSession = 6;
  let eventCount = 0;

  const sessionsToGenerate = Math.ceil(actualEventsCount / eventsPerSession);

  console.log(
    `Preparing ${sessionsToGenerate.toLocaleString()} sessions with timestamps...`
  );

  // Pre-generate timestamps for the day with realistic distribution in batches
  // This reduces memory pressure while maintaining chronological order
  const TIMESTAMP_BATCH_SIZE = 100000;
  let totalTimestampsGenerated = 0;
  let timestampBatch = [];

  // For tracking progress
  const progressInterval = Math.max(Math.ceil(sessionsToGenerate / 50), 500); // Show progress more frequently
  const startGenerationTime = Date.now();
  let lastProgressTime = startGenerationTime;

  // For improved ETA calculation
  let recentRates = [];
  const MAX_RATES_TO_TRACK = 5; // Keep track of the last 5 generation rates

  console.log(`Beginning event generation in optimized batches...`);

  // Process in batches to optimize memory usage and performance
  while (totalTimestampsGenerated < sessionsToGenerate) {
    // Generate next batch of timestamps
    const batchSize = Math.min(
      TIMESTAMP_BATCH_SIZE,
      sessionsToGenerate - totalTimestampsGenerated
    );
    timestampBatch = [];

    // Generate timestamps
    for (let i = 0; i < batchSize; i++) {
      timestampBatch.push(
        generateTimeForDay(DateTime.fromJSDate(date.toJSDate()))
      );
    }

    // Sort this batch chronologically
    timestampBatch.sort((a, b) => a.toMillis() - b.toMillis());

    // Process each timestamp to generate sessions and events
    for (let idx = 0; idx < timestampBatch.length; idx++) {
      const timestamp = timestampBatch[idx];
      const sessionIdx = totalTimestampsGenerated + idx;

      // Display progress updates periodically
      if (
        sessionIdx % progressInterval === 0 ||
        sessionIdx === sessionsToGenerate - 1
      ) {
        const currentTime = Date.now();
        const elapsedSeconds = (currentTime - startGenerationTime) / 1000;
        const timeSinceLastProgress = (currentTime - lastProgressTime) / 1000;

        // Calculate progress based on actual events generated, not sessions
        const percentComplete = Math.min(
          ((eventCount / actualEventsCount) * 100).toFixed(1),
          100.0
        );

        // Format elapsed time
        const elapsedFormatted = formatTime(elapsedSeconds);

        // Calculate current generation rate for this interval
        const currentIntervalRate =
          eventCount > 0 ? Math.round(eventCount / elapsedSeconds) : 0;

        // Store recent rates for weighted average calculation
        if (timeSinceLastProgress > 0) {
          // Calculate rate just for this most recent interval
          const newEventsInThisInterval =
            eventCount -
            (recentRates.length > 0
              ? eventCount -
                (elapsedSeconds - timeSinceLastProgress) * currentIntervalRate
              : 0);
          const intervalRate = Math.round(
            newEventsInThisInterval / timeSinceLastProgress
          );

          // Add to recent rates, keeping only the most recent ones
          recentRates.push(intervalRate);
          if (recentRates.length > MAX_RATES_TO_TRACK) {
            recentRates.shift(); // Remove oldest rate
          }
        }

        // Calculate weighted average of recent rates (more weight to recent rates)
        let weightedRate = currentIntervalRate;
        if (recentRates.length > 0) {
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
      }

      // Optimized session generation logic
      // Decide whether to continue an existing session or create a new one
      const now = timestamp.toMillis();
      let sessionId, userId, sessionData;

      // First expire old sessions (more than 30 minutes old)
      if (activeSessions.size > 100) {
        // Only check when we have many active sessions
        for (const [sid, sessionInfo] of activeSessions.entries()) {
          if (now - sessionInfo.lastActivity > 30 * 60 * 1000) {
            activeSessions.delete(sid);
          }
        }
      }

      // 20% chance to continue an existing session if any are active and not too many sessions
      if (
        activeSessions.size > 0 &&
        activeSessions.size < 1000 &&
        Math.random() < 0.2
      ) {
        // Continue an existing session (select one of the first 50 to keep it fast)
        const activeSids = Array.from(activeSessions.keys()).slice(0, 50);
        sessionId = activeSids[Math.floor(Math.random() * activeSids.length)];
        const sessionInfo = activeSessions.get(sessionId);
        userId = sessionInfo.userId;
        sessionData = sessionInfo.data;

        // Update last activity timestamp
        sessionInfo.lastActivity = now;
      } else {
        // Create a new session
        sessionId = generateUUID();
        userId = userIds[Math.floor(Math.random() * userIds.length)];
        sessionData = generateSessionData();

        // Add to active sessions
        activeSessions.set(sessionId, {
          userId,
          data: sessionData,
          lastActivity: now,
        });
      }

      // Generate events for this session using fast, optimized event generation
      const sessionEvents = generateSessionEventsOptimized(
        userId,
        sessionId,
        timestamp,
        sessionData
      );

      // Add these events to our collection using batch arrays
      const newEventCount = sessionEvents.length;

      // Add events to the current batch, creating new batches as needed
      for (let i = 0; i < newEventCount; i++) {
        // If current batch is full, add it to batches and create a new one
        if (currentBatch.length >= BATCH_SIZE) {
          eventBatches.push(currentBatch);
          currentBatch = [];
        }

        // Add event to current batch
        currentBatch.push(sessionEvents[i]);
        eventCount++;
      }

      // Check if we've reached our target event count
      if (eventCount >= actualEventsCount) {
        break;
      }
    }

    totalTimestampsGenerated += timestampBatch.length;

    // If we've reached our target event count, break out
    if (eventCount >= actualEventsCount) {
      break;
    }
  }

  // Don't forget to add the last batch if it has any events
  if (currentBatch.length > 0) {
    eventBatches.push(currentBatch);
  }

  // Flatten all batches into a single array, but only up to the actualEventsCount
  // This is more memory-efficient than pre-allocating a huge array
  let finalEvents = [];
  let remainingEvents = Math.min(eventCount, actualEventsCount);

  for (const batch of eventBatches) {
    if (remainingEvents <= 0) break;

    const eventsToTake = Math.min(batch.length, remainingEvents);
    finalEvents = finalEvents.concat(batch.slice(0, eventsToTake));
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

  // Add timing measurement
  const startTime = Date.now();
  let totalInserted = 0;

  // Increase batch size for higher throughput
  const INSERTION_BATCH_SIZE = 50000; // Increased from 10000 to 50000

  // Create batches
  const insertionBatches = [];
  for (let i = 0; i < finalEvents.length; i += INSERTION_BATCH_SIZE) {
    insertionBatches.push(finalEvents.slice(i, i + INSERTION_BATCH_SIZE));
  }

  // Maximum number of parallel inserts (based on CPU cores)
  const MAX_PARALLEL = 3; // Using 3 of the 4 cores for parallelism

  // Process batches with controlled parallelism
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

          const totalElapsed = (Date.now() - startTime) / 1000;
          const averageSpeed = Math.round(totalInserted / totalElapsed);

          console.log(
            `Inserted batch ${result.batchIndex + 1} of ${
              insertionBatches.length
            } | ` +
              `Batch speed: ${result.batchSpeed.toLocaleString()} events/sec | ` +
              `Avg speed: ${averageSpeed.toLocaleString()} events/sec`
          );
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

// Optimized version of generateSessionEvents for speed
function generateSessionEventsOptimized(
  userId,
  sessionId,
  startTime,
  sessionData
) {
  const events = [];
  let currentTime = startTime;

  // Use simpler random number generation for speed
  const sessionDuration = Math.floor(Math.random() * 1800) + 60; // 1-30 minutes in seconds
  const numberOfPageviews = Math.floor(Math.random() * 12) + 1; // 1-12 pageviews per session

  let currentPath = null;
  let currentProduct = null;
  let cartItems = [];
  let hasPurchased = false;

  // Pre-allocate array for better performance
  events.length = Math.min(numberOfPageviews * 3, 30); // Approximate - allow space for multiple events per page
  let eventCount = 0;

  // Avoid repeated code by creating a template event object
  const baseEvent = {
    site_id: SITE_ID,
    session_id: sessionId,
    user_id: userId,
    hostname: SITE_DOMAIN,
    browser: sessionData.browser,
    browser_version: sessionData.browserVersion,
    operating_system: sessionData.os,
    operating_system_version: sessionData.osVersion,
    language: sessionData.language,
    screen_width: sessionData.screenWidth,
    screen_height: sessionData.screenHeight,
    device_type: sessionData.deviceType,
    country: sessionData.country,
    iso_3166_2: sessionData.iso3166,
  };

  // Simplified page selection logic for speed
  for (let i = 0; i < numberOfPageviews; i++) {
    // Select page
    if (i === 0) {
      // First page - entry point
      const entryPages = [
        pagePaths[0], // homepage
        pagePaths[1], // products
        // A few random category pages
        pagePaths[Math.floor(Math.random() * 5) + 15],
        pagePaths[Math.floor(Math.random() * 5) + 15],
      ];
      currentPath = entryPages[Math.floor(Math.random() * entryPages.length)];
    } else {
      // Follow simplified, faster pathing logic
      if (currentPath.path.startsWith("/product/") && Math.random() < 0.4) {
        // From product, might add to cart and go to cart
        if (Math.random() < 0.4 && currentPath.product) {
          cartItems.push(currentPath.product);
        }

        if (cartItems.length > 0 && Math.random() < 0.5) {
          // Go to cart
          currentPath =
            pagePaths.find((p) => p.path === "/cart") || pagePaths[0];
        } else {
          // Go to another product or category
          const idx = Math.floor(Math.random() * pagePaths.length);
          currentPath = pagePaths[idx];
        }
      } else if (currentPath.path === "/cart" && cartItems.length > 0) {
        // From cart, might go to checkout
        if (Math.random() < 0.6) {
          currentPath =
            pagePaths.find((p) => p.path === "/checkout") || pagePaths[0];
        } else {
          // Continue shopping
          const idx = Math.floor(Math.random() * pagePaths.length);
          currentPath = pagePaths[idx];
        }
      } else if (
        currentPath.path === "/checkout" &&
        cartItems.length > 0 &&
        !hasPurchased
      ) {
        if (Math.random() < 0.7) {
          // Purchase completed
          hasPurchased = true;
          currentPath =
            pagePaths.find((p) => p.path === "/order-history") || pagePaths[0];
        } else {
          // Abandoned
          currentPath =
            pagePaths.find((p) => p.path === "/cart") || pagePaths[0];
        }
      } else {
        // Random navigation
        const idx = Math.floor(Math.random() * pagePaths.length);
        currentPath = pagePaths[idx];
      }
    }

    // Update product if on product page
    if (currentPath.path.startsWith("/product/")) {
      currentProduct = currentPath.product;
    }

    // Determine querystring (simplified)
    let querystring = "";
    if (Math.random() < 0.3) {
      for (const prefix in tabParams) {
        if (currentPath.path.includes(prefix)) {
          const params = tabParams[prefix];
          querystring = params[Math.floor(Math.random() * params.length)].param;
          break;
        }
      }
    }

    // Add pageview event
    currentTime = startTime.plus({
      seconds: i * 30 + Math.floor(Math.random() * 30),
    });
    events[eventCount++] = {
      ...baseEvent,
      timestamp: currentTime.toFormat("yyyy-MM-dd HH:mm:ss"),
      pathname: currentPath.path,
      querystring: querystring,
      page_title: currentPath.title,
      referrer: i === 0 ? sessionData.referrer : "",
      type: "pageview",
      event_name: "",
      properties: "",
    };

    // Add custom event based on page type (simplified for speed)
    if (currentPath.path.startsWith("/product/") && currentProduct) {
      // Product view
      currentTime = currentTime.plus({
        seconds: Math.floor(Math.random() * 5) + 2,
      });
      events[eventCount++] = {
        ...baseEvent,
        timestamp: currentTime.toFormat("yyyy-MM-dd HH:mm:ss"),
        pathname: currentPath.path,
        querystring: querystring,
        page_title: currentPath.title,
        referrer: "",
        type: "custom_event",
        event_name: "product-view",
        properties: JSON.stringify({
          product_id: currentProduct.id,
          product_name: currentProduct.name,
          category: currentProduct.category,
          price: currentProduct.price,
          currency: "USD",
        }),
      };

      // Possible add to cart (30% chance)
      if (Math.random() < 0.3 && !cartItems.includes(currentProduct)) {
        currentTime = currentTime.plus({
          seconds: Math.floor(Math.random() * 10) + 5,
        });
        cartItems.push(currentProduct);

        events[eventCount++] = {
          ...baseEvent,
          timestamp: currentTime.toFormat("yyyy-MM-dd HH:mm:ss"),
          pathname: currentPath.path,
          querystring: querystring,
          page_title: currentPath.title,
          referrer: "",
          type: "custom_event",
          event_name: "add-to-cart",
          properties: JSON.stringify({
            product_id: currentProduct.id,
            product_name: currentProduct.name,
            category: currentProduct.category,
            price: currentProduct.price,
            quantity: 1,
            currency: "USD",
          }),
        };
      }
    } else if (currentPath.path === "/cart" && cartItems.length > 0) {
      // View cart
      const cartTotal = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.price),
        0
      );

      events[eventCount++] = {
        ...baseEvent,
        timestamp: currentTime.toFormat("yyyy-MM-dd HH:mm:ss"),
        pathname: currentPath.path,
        querystring: querystring,
        page_title: currentPath.title,
        referrer: "",
        type: "custom_event",
        event_name: "view-cart",
        properties: JSON.stringify({
          items_count: cartItems.length,
          value: cartTotal.toFixed(2),
          currency: "USD",
        }),
      };
    } else if (
      currentPath.path === "/checkout" &&
      cartItems.length > 0 &&
      !hasPurchased
    ) {
      // Begin checkout
      const cartTotal = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.price),
        0
      );

      events[eventCount++] = {
        ...baseEvent,
        timestamp: currentTime.toFormat("yyyy-MM-dd HH:mm:ss"),
        pathname: currentPath.path,
        querystring: querystring,
        page_title: currentPath.title,
        referrer: "",
        type: "custom_event",
        event_name: "begin-checkout",
        properties: JSON.stringify({
          items_count: cartItems.length,
          value: cartTotal.toFixed(2),
          currency: "USD",
        }),
      };

      // Add purchase if this is the last pageview or randomly
      if (
        (i === numberOfPageviews - 1 || Math.random() < 0.7) &&
        !hasPurchased
      ) {
        currentTime = currentTime.plus({
          seconds: Math.floor(Math.random() * 30) + 20,
        });
        const transactionId = Math.random()
          .toString(36)
          .substring(2, 10)
          .toUpperCase();

        events[eventCount++] = {
          ...baseEvent,
          timestamp: currentTime.toFormat("yyyy-MM-dd HH:mm:ss"),
          pathname: currentPath.path,
          querystring: querystring,
          page_title: currentPath.title,
          referrer: "",
          type: "custom_event",
          event_name: "purchase",
          properties: JSON.stringify({
            transaction_id: transactionId,
            value: cartTotal.toFixed(2),
            tax: (cartTotal * 0.08).toFixed(2),
            shipping: (Math.random() * 10 + 5).toFixed(2),
            currency: "USD",
            coupon: Math.random() < 0.3 ? "SAVE20" : "",
            items: cartItems.map((item) => ({
              product_id: item.id,
              product_name: item.name,
              category: item.category,
              price: item.price,
              quantity: 1,
            })),
          }),
        };

        hasPurchased = true;
      }
    }

    // Return if we exceed session duration
    if (currentTime > startTime.plus({ seconds: sessionDuration })) {
      break;
    }
  }

  // Return only the populated part of the array
  return events.slice(0, eventCount);
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

// Main function to generate all the data
async function generateMockData() {
  let totalEvents = 0;

  // Generate data for each day, starting from the most recent
  for (let day = 0; day < daysInPast; day++) {
    const date = DateTime.now().minus({ days: day });
    const eventsCount = await generateEventsForDay(date, eventsPerDay);
    totalEvents += eventsCount;
    console.log(
      `Completed day ${day + 1} of ${daysInPast}. Total events: ${totalEvents}`
    );
  }

  console.log(
    `Mock data generation complete. Generated ${totalEvents} events across ${daysInPast} days.`
  );
  process.exit(0);
}

// Start the data generation
generateMockData().catch((error) => {
  console.error("Error generating mock data:", error);
  process.exit(1);
});
