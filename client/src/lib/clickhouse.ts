import { createClient } from "@clickhouse/client";

// When running locally with npm run dev, use localhost
// When running in Docker, use container name
const isDevelopment = process.env.NODE_ENV === "development";
const host = isDevelopment ? "http://localhost:8123" : "http://clickhouse:8123";

// Override for development purposes for when you want to connect to a prod database
const clickhouseHostOverride = process.env.CLICKHOUSE_HOST;

export const clickhouse = createClient({
  host: clickhouseHostOverride || host,
  database: "analytics",
});
