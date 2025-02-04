"use server";

import { clickhouse } from "@/lib/clickhouse";
import { getTimeStatement } from "./utils";
import { TimeBucket } from "../../lib/timeSelectionStore";

export type GetPageViewsResponse = { time: string; pageviews: number }[];

const TimeBucketToFn = {
  hour: "toStartOfHour",
  day: "toStartOfDay",
  week: "toStartOfWeek",
  month: "toStartOfMonth",
};

export async function getPageViews({
  startDate,
  endDate,
  timezone = "America/Los_Angeles",
  bucket,
}: {
  startDate: string;
  endDate: string;
  timezone: string;
  bucket: TimeBucket;
}): Promise<{ data?: GetPageViewsResponse; error?: string }> {
  const query = `
    SELECT
        ${TimeBucketToFn[bucket]}(toTimeZone(timestamp, '${timezone}')) AS time,
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
