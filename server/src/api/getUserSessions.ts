import { FastifyReply, FastifyRequest } from "fastify";
import clickhouse from "../db/clickhouse/clickhouse.js";
import {
  getFilterStatement,
  getTimeStatement,
  processResults,
} from "./utils.js";

// Individual pageview type
type Pageview = {
  session_id: string;
  timestamp: string;
  pathname: string;
  querystring: string;
  page_title: string;
  referrer: string;
  browser: string;
  operating_system: string;
  device_type: string;
  country: string;
};

// Grouped session type to be returned to the client
type GroupedSession = {
  session_id: string;
  browser: string;
  operating_system: string;
  device_type: string;
  country: string;
  firstTimestamp: string;
  lastTimestamp: string;
  pageviews: {
    pathname: string;
    title: string;
    timestamp: string;
    referrer: string;
  }[];
};

export interface GetUserSessionsRequest {
  Querystring: {
    startDate: string;
    endDate: string;
    timezone: string;
    site: string;
    filters: string;
  };
  Params: {
    userId: string;
  };
}

export async function getUserSessions(
  {
    query: { startDate, endDate, timezone, site, filters },
    params: { userId },
  }: FastifyRequest<GetUserSessionsRequest>,
  res: FastifyReply
) {
  const filterStatement = getFilterStatement(filters);

  const query = `
SELECT
    session_id,
    timestamp,
    pathname,
    querystring,
    page_title,
    referrer,
    browser,
    operating_system,
    device_type,
    country
FROM pageviews
WHERE
    site_id = ${site}
    AND user_id = '${userId}'
    ${filterStatement}
    ${getTimeStatement(startDate, endDate, timezone)}
ORDER BY timestamp ASC
  `;

  try {
    const result = await clickhouse.query({
      query,
      format: "JSONEachRow",
    });

    const pageviews = await processResults<Pageview>(result);

    // Group pageviews by session
    const sessions: Record<string, GroupedSession> = {};

    pageviews.forEach((pageview) => {
      const {
        session_id,
        timestamp,
        pathname,
        querystring,
        page_title,
        referrer,
        browser,
        operating_system,
        device_type,
        country,
      } = pageview;

      // Construct full URL from pathname and querystring
      const url = querystring ? `${pathname}?${querystring}` : pathname;

      if (!sessions[session_id]) {
        sessions[session_id] = {
          session_id,
          browser,
          operating_system,
          device_type,
          country,
          firstTimestamp: timestamp,
          lastTimestamp: timestamp,
          pageviews: [],
        };
      }

      // Update timestamps
      if (timestamp < sessions[session_id].firstTimestamp) {
        sessions[session_id].firstTimestamp = timestamp;
      }
      if (timestamp > sessions[session_id].lastTimestamp) {
        sessions[session_id].lastTimestamp = timestamp;
      }

      // Add pageview
      sessions[session_id].pageviews.push({
        pathname: url,
        title: page_title || url,
        timestamp,
        referrer,
      });

      // Sort pageviews by timestamp in descending order
      sessions[session_id].pageviews.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    });

    // Convert to array and sort by most recent session
    const groupedSessions = Object.values(sessions).sort(
      (a, b) =>
        new Date(b.lastTimestamp).getTime() -
        new Date(a.lastTimestamp).getTime()
    );

    return res.send({ data: groupedSessions });
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    return res.status(500).send({ error: "Failed to fetch user sessions" });
  }
}
