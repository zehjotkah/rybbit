"use server";

import { clickhouse } from "@/lib/clickhouse";
import { getTimeStatement } from "./utils";

type GetReferrersResponse = {
  referrer: string;
  count: number;
  percentage: number;
}[];

export async function getReferrers({
  startDate,
  endDate,
  timezone = "America/Los_Angeles",
}: {
  startDate: string;
  endDate: string;
  timezone: string;
}): Promise<{ data?: GetReferrersResponse; error?: string }> {
  const query = `
    SELECT
      domainWithoutWWW(referrer) AS referrer,
      COUNT(*) as count,
      ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
    FROM pageviews
    WHERE
        ${getTimeStatement(startDate, endDate, timezone)}
    GROUP BY referrer 
    ORDER BY count desc
    LIMIT 100;
  `;

  try {
    const result = await clickhouse.query({
      query,
      format: "JSONEachRow",
    });

    const data: GetReferrersResponse = await result.json();
    return { data };
  } catch (error) {
    console.error("Error fetching referrers:", error);
    return { error: "Failed to fetch referrers" };
  }
}
