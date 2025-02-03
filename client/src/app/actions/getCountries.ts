"use server";

import { clickhouse } from "@/lib/clickhouse";
import { getTimeStatement, processResults } from "./utils";

type GetCountriesResponse = {
  country: string;
  count: number;
  percentage: number;
}[];

export async function getCountries({
  startDate,
  endDate,
  timezone = "America/Los_Angeles",
}: {
  startDate: string;
  endDate: string;
  timezone: string;
}): Promise<{ data?: GetCountriesResponse; error?: string }> {
  const query = `
    SELECT
      country,
      COUNT(*) as count,
      ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
    FROM pageviews
    WHERE
        ${getTimeStatement(startDate, endDate, timezone)}
    GROUP BY country ORDER BY count desc;
  `;

  try {
    const result = await clickhouse.query({
      query,
      format: "JSONEachRow",
    });

    const data = await processResults<GetCountriesResponse[number]>(result);
    return { data };
  } catch (error) {
    console.error("Error fetching countries:", error);
    return { error: "Failed to fetch countries" };
  }
}
