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
  return `WITH FILL FROM toTimeZone(
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
    ) STEP INTERVAL ${bucketIntervalMap[bucket]}`;
}

type TimeBucket = "hour" | "day" | "week" | "month";

type getOverviewBucketed = { time: string; pageviews: number }[];

export async function getOverviewBucketed(
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
  const isAllTime = !startDate && !endDate;

  const query = `SELECT
    session_stats.time AS time,
    session_stats.sessions,
    session_stats.pages_per_session,
    session_stats.bounce_rate * 100 AS bounce_rate,
    session_stats.session_duration,
    page_stats.pageviews,
    page_stats.users
FROM
(
    SELECT
         ${
           TimeBucketToFn[bucket]
         }(toTimeZone(start_time, '${timezone}')) AS time,
        COUNT() AS sessions,
        AVG(pages_in_session) AS pages_per_session,
        sumIf(1, pages_in_session = 1) / COUNT() AS bounce_rate,
        AVG(end_time - start_time) AS session_duration
    FROM
    (
        /* One row per session */
        SELECT
            session_id,
            MIN(timestamp) AS start_time,
            MAX(timestamp) AS end_time,
            COUNT(*) AS pages_in_session
        FROM pageviews
        WHERE 
            site_id = ${site}
            ${getTimeStatement(startDate, endDate, timezone)}
        GROUP BY session_id
    )
    GROUP BY time ORDER BY time ${
      isAllTime
        ? ""
        : getTimeStatementFill(startDate, endDate, timezone, bucket)
    }
) AS session_stats
FULL JOIN
(
    SELECT
         ${
           TimeBucketToFn[bucket]
         }(toTimeZone(timestamp, '${timezone}')) AS time,
        COUNT(*) AS pageviews,
        COUNT(DISTINCT user_id) AS users
    FROM pageviews
    WHERE
        site_id = ${site}
        ${getTimeStatement(startDate, endDate, timezone)}
    GROUP BY time ORDER BY time ${
      isAllTime
        ? ""
        : getTimeStatementFill(startDate, endDate, timezone, bucket)
    }
) AS page_stats
USING time
ORDER BY time`;

  console.info(query);

  try {
    const result = await clickhouse.query({
      query,
      format: "JSONEachRow",
    });

    const data = await processResults<getOverviewBucketed[number]>(result);
    return res.send({ data });
  } catch (error) {
    console.error("Error fetching pageviews:", error);
    return res.status(500).send({ error: "Failed to fetch pageviews" });
  }
}
