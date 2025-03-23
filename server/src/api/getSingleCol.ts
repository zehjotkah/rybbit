import { FastifyReply, FastifyRequest } from "fastify";
import clickhouse from "../db/clickhouse/clickhouse.js";
import {
  geSqlParam,
  getFilterStatement,
  getTimeStatement,
  processResults,
} from "./utils.js";
import { getUserHasAccessToSite } from "../lib/auth-utils.js";
import { FilterParameter } from "./types.js";

interface GenericRequest {
  Querystring: {
    startDate: string;
    endDate: string;
    timezone: string;
    site: string;
    filters: string;
    parameter: FilterParameter;
    limit?: number;
  };
}

type GetSingleColResponse = {
  value: string;
  count: number;
  percentage: number;
  avg_session_duration?: number;
  bounce_rate?: number;
}[];

const getQuery = (request: GenericRequest["Querystring"]) => {
  const { startDate, endDate, timezone, site, filters, parameter, limit } =
    request;

  const filterStatement = getFilterStatement(filters);

  if (parameter === "dimensions") {
    return `
    SELECT
      concat(toString(screen_width), 'x', toString(screen_height)) AS value,
      COUNT(*) as count,
      ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
    FROM sessions_mv
    WHERE
      site_id = ${site}
      ${filterStatement}
      ${getTimeStatement(startDate, endDate, timezone, "sessions")}
    GROUP BY value ORDER BY count desc
    ${limit ? `LIMIT ${limit}` : ""};`;
  }

  if (["querystring", "page_title", "pathname"].includes(parameter)) {
    return `
      SELECT
        ${geSqlParam(parameter)} as value,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
      FROM pageviews
      WHERE
          site_id = ${site}
          ${filterStatement}
          ${getTimeStatement(startDate, endDate, timezone)}
          AND type = 'pageview'
      GROUP BY value ORDER BY count desc
      ${limit ? `LIMIT ${limit}` : ""};
    `;
  }

  return `
    SELECT
        ${parameter} as value,
        count() as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage,
        ROUND(AVG(dateDiff('second', session_start, session_end))) as avg_session_duration,
        ROUND(SUM(if(pageviews = 1, 1, 0)) * 100.0 / COUNT(), 2) as bounce_rate
    FROM
        sessions_mv
    WHERE
        site_id = ${site}
        AND notEmpty(${parameter})
        ${getTimeStatement(startDate, endDate, timezone, "sessions")}
    GROUP BY
      ${parameter}
    ORDER BY
        COUNT() DESC
    ${limit ? `LIMIT ${limit}` : ""};
  `;
};

export async function getSingleCol(
  req: FastifyRequest<GenericRequest>,
  res: FastifyReply
) {
  const { site, parameter } = req.query;

  const userHasAccessToSite = await getUserHasAccessToSite(req, site);
  if (!userHasAccessToSite) {
    return res.status(403).send({ error: "Forbidden" });
  }

  const query = getQuery(req.query);

  try {
    const result = await clickhouse.query({
      query,
      format: "JSONEachRow",
    });

    const data = await processResults<GetSingleColResponse[number]>(result);
    return res.send({ data });
  } catch (error) {
    console.error(`Error fetching ${parameter}:`, error);
    return res.status(500).send({ error: `Failed to fetch ${parameter}` });
  }
}
