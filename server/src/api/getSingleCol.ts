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
    type: "events" | "sessions";
    limit?: number;
  };
}

type GetSingleColResponse = {
  value: string;
  count: number;
  percentage: number;
}[];

const getQuery = (request: GenericRequest["Querystring"]) => {
  const {
    startDate,
    endDate,
    timezone,
    site,
    filters,
    parameter,
    limit,
    type,
  } = request;

  const filterStatement = getFilterStatement(filters);

  if (parameter === "exit_page" || parameter === "entry_page") {
    return `
    SELECT
        ${parameter} as value,
        count() as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
    FROM
        sessions_mv
    WHERE 
        site_id = ${site} 
        AND notEmpty(entry_page)
        ${getTimeStatement(startDate, endDate, timezone, "sessions")}
    GROUP BY
      ${parameter}
    ORDER BY
        COUNT() DESC
    ${limit ? `LIMIT ${limit}` : ""};
    `;
  }

  if (parameter === "dimensions") {
    return `
    SELECT
      concat(toString(screen_width), 'x', toString(screen_height)) AS value,
      ${
        type === "sessions"
          ? "COUNT(distinct(session_id)) as count"
          : "COUNT(*) as count"
      },
      ${
        type === "sessions"
          ? `ROUND(
          COUNT(distinct(session_id)) * 100.0 / SUM(COUNT(distinct(session_id))) OVER (),
          2
      ) as percentage`
          : "ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage"
      }
    FROM pageviews
    WHERE
      site_id = ${site}
      ${filterStatement}
      ${getTimeStatement(startDate, endDate, timezone)}
    GROUP BY value ORDER BY count desc
    ${limit ? `LIMIT ${limit}` : ""};`;
  }

  return `
    SELECT
      ${geSqlParam(parameter)} as value,
      ${
        type === "sessions"
          ? "COUNT(distinct(session_id)) as count"
          : "COUNT(*) as count"
      },
      ${
        type === "sessions"
          ? `ROUND(
          COUNT(distinct(session_id)) * 100.0 / SUM(COUNT(distinct(session_id))) OVER (),
          2
      ) as percentage`
          : "ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage"
      }
    FROM pageviews
    WHERE
        site_id = ${site}
        ${filterStatement}
        ${getTimeStatement(startDate, endDate, timezone)}
        AND type = 'pageview'
    GROUP BY value ORDER BY count desc
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
