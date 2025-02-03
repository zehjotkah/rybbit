"use server";

import { clickhouse } from "@/lib/clickhouse";
import { getTimeStatement } from "./utils";

type Response = {
  operating_system: string;
  count: number;
  percentage: number;
}[];

export async function getOperatingSystems({
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
      operating_system,
      COUNT(*) as count,
      ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
    FROM pageviews
    WHERE
        ${getTimeStatement(startDate, endDate, timezone)}
    GROUP BY operating_system ORDER BY count desc;
  `;

  try {
    const result = await clickhouse.query({
      query,
      format: "JSONEachRow",
    });

    const data: Response = await result.json();
    return { data };
  } catch (error) {
    console.error("Error fetching operating systems:", error);
    return { error: "Failed to fetch operating systems" };
  }
}
