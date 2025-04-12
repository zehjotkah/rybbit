import { FastifyReply, FastifyRequest } from "fastify";
import clickhouse from "../../db/clickhouse/clickhouse.js";
import {
  getFilterStatement,
  getTimeStatement,
  processResults,
} from "./utils.js";
import { getUserHasAccessToSitePublic } from "../../lib/auth-utils.js";

const TimeBucketToFn = {
  minute: "toStartOfMinute",
  five_minutes: "toStartOfFiveMinutes",
  ten_minutes: "toStartOfTenMinutes",
  fifteen_minutes: "toStartOfFifteenMinutes",
  hour: "toStartOfHour",
  day: "toStartOfDay",
  week: "toStartOfWeek",
  month: "toStartOfMonth",
  year: "toStartOfYear",
};

const bucketIntervalMap = {
  minute: "1 MINUTE",
  five_minutes: "5 MINUTES",
  ten_minutes: "10 MINUTES",
  fifteen_minutes: "15 MINUTES",
  hour: "1 HOUR",
  day: "1 DAY",
  week: "7 DAY",
  month: "1 MONTH",
  year: "1 YEAR",
} as const;

function getTimeStatementFill(
  {
    date,
    pastMinutes,
  }: {
    date?: { startDate: string; endDate: string; timezone: string };
    pastMinutes?: number;
  },
  bucket: TimeBucket
) {
  if (date) {
    const { startDate, endDate, timezone } = date;
    return `WITH FILL FROM toTimeZone(
      toDateTime(${TimeBucketToFn[bucket]}(toDateTime('${startDate}', '${timezone}'))),
      'UTC'
      )
      TO if(
        toDate('${endDate}') = toDate(now(), '${timezone}'),
        now(),
        toTimeZone(
          toDateTime(${TimeBucketToFn[bucket]}(toDateTime('${endDate}', '${timezone}'))) + INTERVAL 1 DAY,
          'UTC'
        )
      ) STEP INTERVAL ${bucketIntervalMap[bucket]}`;
  }
  if (pastMinutes) {
    return `WITH FILL FROM now() - INTERVAL ${pastMinutes} MINUTE TO now() STEP INTERVAL ${bucketIntervalMap[bucket]}`;
  }
  return "";
}

const getQuery = ({
  startDate,
  endDate,
  timezone,
  bucket,
  site,
  filters,
  pastMinutes,
}: {
  startDate: string;
  endDate: string;
  timezone: string;
  bucket: TimeBucket;
  site: string;
  filters: string;
  pastMinutes?: number;
}) => {
  const filterStatement = getFilterStatement(filters);

  const isAllTime = !startDate && !endDate;

  const query = `
SELECT
    time,
    pageviews,
    users,
    sessions,
    IF(sessions > 0, pageviews / sessions, 0) AS pages_per_session,
    IF(sessions > 0, bounce_count / sessions * 100, 0) AS bounce_rate,
    IF(sessions > 0, total_duration / sessions, 0) AS session_duration
FROM
(
    SELECT
        bucketed_time AS time,
        COUNT(*) AS pageviews,
        COUNT(DISTINCT user_id) AS users,
        COUNT(DISTINCT session_id) AS sessions,
        SUM(is_bounce) AS bounce_count,
        SUM(duration) AS total_duration
    FROM
    (
        SELECT
            user_id,
            session_id,
            toDateTime(${
              TimeBucketToFn[bucket]
            }(toTimeZone(timestamp, '${timezone}'))) AS bucketed_time,
            multiIf(
                session_pageviews = 1, 1,
                0
            ) AS is_bounce,
            if(
                is_session_start,
                session_duration,
                0
            ) AS duration
        FROM
        (
            SELECT
                p.user_id,
                p.session_id,
                p.timestamp,
                p.type,
                COUNT(*) OVER (PARTITION BY p.session_id) AS session_pageviews,
                min(p.timestamp) OVER (PARTITION BY p.session_id) = p.timestamp AS is_session_start,
                max(p.timestamp) OVER (PARTITION BY p.session_id) - min(p.timestamp) OVER (PARTITION BY p.session_id) AS session_duration
            FROM pageviews p
            WHERE
                p.site_id = ${site}
                ${filterStatement}
                ${getTimeStatement(
                  pastMinutes
                    ? { pastMinutes }
                    : {
                        date: { startDate, endDate, timezone },
                      }
                )}
                AND p.type = 'pageview'
        )
    )
    GROUP BY time
    ORDER BY time ${
      isAllTime
        ? ""
        : getTimeStatementFill(
            pastMinutes
              ? { pastMinutes }
              : { date: { startDate, endDate, timezone } },
            bucket
          )
    }
)
ORDER BY time`;

  return query;
};

type TimeBucket = "hour" | "day" | "week" | "month";

type getOverviewBucketed = { time: string; pageviews: number }[];

export async function getOverviewBucketed(
  req: FastifyRequest<{
    Params: {
      site: string;
    };
    Querystring: {
      startDate: string;
      endDate: string;
      timezone: string;
      bucket: TimeBucket;
      filters: string;
      pastMinutes?: number;
    };
  }>,
  res: FastifyReply
) {
  const { startDate, endDate, timezone, bucket, filters, pastMinutes } =
    req.query;
  const site = req.params.site;

  const userHasAccessToSite = await getUserHasAccessToSitePublic(req, site);
  if (!userHasAccessToSite) {
    return res.status(403).send({ error: "Forbidden" });
  }

  const query = getQuery({
    startDate,
    endDate,
    timezone,
    bucket,
    site,
    filters,
    pastMinutes,
  });

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
