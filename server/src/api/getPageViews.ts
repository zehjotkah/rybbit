import { FastifyReply, FastifyRequest } from "fastify";
import clickhouse from "../db/clickhouse/clickhouse.js";
import { getTimeStatement, processResults } from "./utils.js";

const TimeBucketToFn = {
  hour: "toStartOfHour",
  day: "toStartOfDay",
  week: "toStartOfWeek",
  month: "toStartOfMonth",
};

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
        time ASC
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
