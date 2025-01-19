import { createClient } from "@clickhouse/client";
import { format } from "date-fns";
import { getBrowserDetails } from "../utils";

const client = createClient({
  host: process.env.CLICKHOUSE_HOST,
  database: process.env.CLICKHOUSE_DB,
});

export const initializeDatabase = async () => {
  // Create pageviews table
  await client.exec({
    query: `
      CREATE TABLE IF NOT EXISTS pageviews (
        timestamp DateTime,
        session_id String,
        hostname String,
        pathname String,
        querystring String,
        referrer String,
        user_agent String,
        ip_address String,
        browser String,
        language String,
        screen_width UInt16,
        screen_height UInt16,
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
        page_url String,
        ip_address String
      )
      ENGINE = MergeTree()
      PARTITION BY toYYYYMM(timestamp)
      ORDER BY (timestamp, session_id)
    `,
  });

  // Create sessions table
  await client.exec({
    query: `
      CREATE TABLE IF NOT EXISTS sessions (
        hostname String,
        session_id String,
        start_time DateTime,
        end_time DateTime,
        entry_page String,
        exit_page String,
        pageviews UInt32,
        events UInt32,
        duration UInt32,
        referrer String,
        user_agent String,
        ip_address String,
        browser String,
        language String,
        country_code String
      )
      ENGINE = MergeTree()
      PARTITION BY toYYYYMM(start_time)
      ORDER BY (session_id, start_time)
    `,
  });
};

export const insertPageview = async (pageview: Record<string, any>) => {
  try {
    const formattedTimestamp = format(
      new Date(pageview.timestamp),
      "yyyy-MM-dd HH:mm:ss"
    );
    await client.insert({
      table: "pageviews",
      values: [
        {
          timestamp: formattedTimestamp,
          session_id: pageview.sessionId,
          hostname: pageview.hostname || "",
          pathname: pageview.pathname || "",
          querystring: pageview.querystring || "",
          referrer: pageview.referrer || "",
          user_agent: pageview.userAgent || "",
          ip_address: pageview.ip_address || "",
          browser: getBrowserDetails(pageview.userAgent || ""),
          language: pageview.language || "",
          screen_width: pageview.screenWidth || 0,
          screen_height: pageview.screenHeight || 0,
          duration: pageview.duration || 0,
        },
      ],
      format: "JSONEachRow",
    });
    return true;
  } catch (error) {
    console.error("Error inserting pageview:", error);
    return false;
  }
};

export const insertEvent = async (event: Record<string, any>) => {
  try {
    await client.insert({
      table: "events",
      values: [
        {
          timestamp: event.timestamp,
          session_id: event.sessionId,
          event_name: event.eventName,
          event_data: JSON.stringify(event.eventData || {}),
          page_url: event.url,
          ip_address: event.ip_address || "",
        },
      ],
      format: "JSONEachRow",
    });
    return true;
  } catch (error) {
    console.error("Error inserting event:", error);
    return false;
  }
};

// Function to insert session data
export const insertSession = async (session: Record<string, any>) => {
  try {
    await client.insert({
      table: "sessions",
      values: [
        {
          session_id: session.sessionId,
          start_time: session.startTime,
          end_time: session.endTime,
          entry_page: session.entryPage,
          exit_page: session.exitPage,
          pageviews: session.pageviews,
          events: session.events,
          duration: session.duration,
          referrer: session.referrer,
          user_agent: session.userAgent,
          ip_address: session.ipAddress,
          browser: session.browser,
          language: session.language,
          country_code: session.countryCode,
        },
      ],
      format: "JSONEachRow",
    });
    return true;
  } catch (error) {
    console.error("Error inserting session:", error);
    return false;
  }
};

export default client;
