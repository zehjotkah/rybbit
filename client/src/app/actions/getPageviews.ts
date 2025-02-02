"use server";

import { clickhouse } from "@/lib/clickhouse";

type Response = { time: string; pageviews: number }[];

export async function getPageViews({
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
        toStartOfHour(toTimeZone(timestamp, '${timezone}')) AS time,
        count() AS pageviews
    FROM pageviews
    WHERE
        timestamp >= toTimeZone(
            toStartOfDay(toDateTime('${startDate}', '${timezone}')),
            'UTC'
        )
        AND timestamp < if(
            toDate('${endDate}') = toDate(now(), '${timezone}'),
            now(),
            toTimeZone(
                toStartOfDay(toDateTime('${endDate}', '${timezone}')) + INTERVAL 1 DAY,
                'UTC'
            )
        )
    GROUP BY
        time
    ORDER BY
        time ASC
  `;

  console.info(query);

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
