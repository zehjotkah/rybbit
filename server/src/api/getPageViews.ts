import { FastifyReply, FastifyRequest } from "fastify";
import clickhouse from "../db/clickhouse/clickhouse.js";
import { getTimeStatement, processResults } from "./utils.js";

const TimeBucketToFn = {
  hour: "toStartOfHour",
  day: "toStartOfDay",
  week: "toStartOfWeek",
  month: "toStartOfMonth",
};

const bucketIntervalMap = {
  hour: "1 HOUR",
  day: "1 DAY",
  week: "7 DAY",
  month: "1 MONTH",
} as const;

function getTimeStatementFill(
  startDate: string,
  endDate: string,
  timezone: string,
  bucket: TimeBucket
) {
  return `
    WITH FILL FROM toTimeZone(
      toStartOfDay(toDateTime('${startDate}', '${timezone}')),
      'UTC'
    )
    TO if(
      toDate('${endDate}') = toDate(now(), '${timezone}'),
      now(),
      toTimeZone(
        toStartOfDay(toDateTime('${endDate}', '${timezone}')) + INTERVAL 1 DAY,
        'UTC'
      )
    ) STEP INTERVAL ${bucketIntervalMap[bucket]}
  `;
}

type TimeBucket = "hour" | "day" | "week" | "month";

type GetPageViewsResponse = { time: string; pageviews: number }[];

export async function getPageViews(
  {
    query: { startDate, endDate, timezone, bucket, site },
  }: FastifyRequest<{
    Querystring: {
      startDate: string;
      endDate: string;
      timezone: string;
      bucket: TimeBucket;
      site: string;
    };
  }>,
  res: FastifyReply
) {
  const query = `
    SELECT
        ${TimeBucketToFn[bucket]}(toTimeZone(timestamp, '${timezone}')) AS time,
        count() AS pageviews
    FROM pageviews
    WHERE
        ${getTimeStatement(startDate, endDate, timezone)}
        AND site_id = ${site}
    GROUP BY
        time
    ORDER BY
        time ${getTimeStatementFill(startDate, endDate, timezone, bucket)}
  `;

  try {
    const result = await clickhouse.query({
      query,
      format: "JSONEachRow",
    });

    const data = await processResults<GetPageViewsResponse[number]>(result);
    return res.send({ data });
  } catch (error) {
    console.error("Error fetching pageviews:", error);
    return res.status(500).send({ error: "Failed to fetch pageviews" });
  }
}
