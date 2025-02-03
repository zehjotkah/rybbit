"use server";

import { clickhouse } from "@/lib/clickhouse";
import { getTimeStatement } from "./utils";

type Response = {
  pathname: string;
  count: number;
  percentage: number;
}[];

export async function getPages({
  startDate,
  endDate,
  timezone = "America/Los_Angeles",
}: {
  startDate: string;
  endDate: string;
  timezone: string;
}): Promise<{ data?: Response; error?: string }> {
  const query = `
    SELECT
      pathname,
      COUNT(*) as count,
      ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
    FROM pageviews
    WHERE
        ${getTimeStatement(startDate, endDate, timezone)}
    GROUP BY pathname 
    ORDER BY count desc
    LIMIT 100;
  `;

  try {
    const result = await clickhouse.query({
      query,
      format: "JSONEachRow",
    });

    const data: Response = await result.json();
    return { data };
  } catch (error) {
    console.error("Error fetching pages:", error);
    return { error: "Failed to fetch pages" };
  }
}
