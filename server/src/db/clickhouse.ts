import { createClient } from "@clickhouse/client";

const client = createClient({
  host: process.env.CLICKHOUSE_HOST || "http://localhost:8123",
  username: process.env.CLICKHOUSE_USER || "admin",
  password: process.env.CLICKHOUSE_PASSWORD || "analytics_password",
  database: process.env.CLICKHOUSE_DB || "analytics",
});

export const initializeDatabase = async () => {
  // Create pageviews table
  await client.exec({
    query: `
      CREATE TABLE IF NOT EXISTS pageviews (
        timestamp DateTime,
        session_id String,
        page_url String,
        referrer String,
        user_agent String,
        ip_address String,
        country String,
        device_type String,
        browser String,
        os String,
        duration UInt32
      )
      ENGINE = MergeTree()
      PARTITION BY toYYYYMM(timestamp)
      ORDER BY (timestamp, session_id)
    `,
  });

  // Create events table
  await client.exec({
    query: `
      CREATE TABLE IF NOT EXISTS events (
        timestamp DateTime,
        session_id String,
        event_name String,
        event_data String,
        page_url String
      )
      ENGINE = MergeTree()
      PARTITION BY toYYYYMM(timestamp)
      ORDER BY (timestamp, session_id)
    `,
  });
};

export default client;
