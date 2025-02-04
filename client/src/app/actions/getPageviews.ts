"use server";

import { clickhouse } from "@/lib/clickhouse";
import { getTimeStatement } from "./utils";

export type GetPageViewsResponse = { time: string; pageviews: number }[];

export async function getPageViews({
  startDate,
  endDate,
  timezone = "America/Los_Angeles",
}: {
  startDate: string;
  endDate: string;
  timezone: string;
}): Promise<{ data?: GetPageViewsResponse; error?: string }> {
  const query = `
    SELECT
        toStartOfHour(toTimeZone(timestamp, '${timezone}')) AS time,
        count() AS pageviews
    FROM pageviews
    WHERE
        ${getTimeStatement(startDate, endDate, timezone)}
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

    const data: GetPageViewsResponse = await result.json();
    return { data };
  } catch (error) {
    console.error("Error fetching pageviews:", error);
    return { error: "Failed to fetch pageviews" };
  }
}
