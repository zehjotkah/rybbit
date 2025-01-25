"use server";

import { clickhouse } from "@/lib/clickhouse";

export async function getPageViews(days: number = 1) {
  const query = `
    SELECT
      formatDateTime(toTimeZone(toStartOfHour(timestamp), 'America/Los_Angeles'), '%Y-%m-%d %H:%M:%S', 'America/Los_Angeles') AS hour,
      count() AS pageviews
    FROM pageviews
    WHERE timestamp >= toTimeZone(now() - INTERVAL ${days} DAY, 'America/Los_Angeles')
    GROUP BY hour
    ORDER BY hour ASC
  `;

  try {
    const result = await clickhouse.query({
      query,
      format: "JSONEachRow",
    });

    const data = await result.json();
    console.info(data);
    return { data };
  } catch (error) {
    console.error("Error fetching pageviews:", error);
    return { error: "Failed to fetch pageviews" };
  }
}
