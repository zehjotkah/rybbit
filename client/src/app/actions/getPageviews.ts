"use server";

import { clickhouse } from "@/lib/clickhouse";

type Response = { time: string; pageviews: number }[];

export async function getPageViews({
  days = 1,
  timezone = "America/Los_Angeles",
}: {
  days: number;
  timezone: string;
}): Promise<{ data?: Response; error?: string }> {
  if (isNaN(days)) {
    days = 1;
  }

  const query = `
    SELECT
        toStartOfHour(toTimeZone(timestamp, '${timezone}')) AS time,
        count() AS pageviews
    FROM pageviews
    WHERE
        timestamp >= toTimeZone(
            toStartOfDay(toTimeZone(now(), '${timezone}')),
            'UTC'
        )
    GROUP BY
        time
    ORDER BY
        time ASC
  `;

  try {
    const result = await clickhouse.query({
      query,
      format: "JSONEachRow",
    });

    const data: Response = await result.json();
    return { data };
  } catch (error) {
    console.error("Error fetching pageviews:", error);
    return { error: "Failed to fetch pageviews" };
  }
}
