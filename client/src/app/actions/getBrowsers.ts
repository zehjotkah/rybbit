"use server";

import { clickhouse } from "@/lib/clickhouse";
import { getTimeStatement } from "./utils";

type GetBrowsersResponse = {
  browser: string;
  count: number;
  percentage: number;
}[];

export async function getBrowsers({
  startDate,
  endDate,
  timezone = "America/Los_Angeles",
}: {
  startDate: string;
  endDate: string;
  timezone: string;
}): Promise<{ data?: GetBrowsersResponse; error?: string }> {
  const query = `
    SELECT
      browser,
      COUNT(*) as count,
      ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
    FROM pageviews
    WHERE
        ${getTimeStatement(startDate, endDate, timezone)}
    GROUP BY browser ORDER BY count desc;
  `;

  try {
    const result = await clickhouse.query({
      query,
      format: "JSONEachRow",
    });

    const data: GetBrowsersResponse = await result.json();
    return { data };
  } catch (error) {
    console.error("Error fetching browsers:", error);
    return { error: "Failed to fetch browsers" };
  }
}
