import { FastifyReply, FastifyRequest } from "fastify";
import clickhouse from "../../db/clickhouse/clickhouse.js";
import {
  getFilterStatement,
  getTimeStatement,
  processResults,
} from "./utils.js";
import { getUserHasAccessToSite } from "../../lib/auth-utils.js";

export type GetUsersResponse = {
  user_id: string;
  country: string;
  browser: string;
  operating_system: string;
  device_type: string;
  pageviews: number;
  events: number;
  sessions: number;
  last_seen: string;
  first_seen: string;
}[];

export interface GetUsersRequest {
  Querystring: {
    startDate: string;
    endDate: string;
    timezone: string;
    site: string;
    filters: string;
    page?: string;
    pageSize?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export async function getUsers(
  req: FastifyRequest<GetUsersRequest>,
  res: FastifyReply
) {
  const {
    startDate,
    endDate,
    timezone,
    site,
    filters,
    page = "1",
    pageSize = "20",
    sortBy = "last_seen",
    sortOrder = "desc",
  } = req.query;

  const userHasAccessToSite = await getUserHasAccessToSite(req, site);
  if (!userHasAccessToSite) {
    return res.status(403).send({ error: "Forbidden" });
  }

  const pageNum = parseInt(page, 10);
  const pageSizeNum = parseInt(pageSize, 10);
  const offset = (pageNum - 1) * pageSizeNum;

  // Validate sort parameters
  const validSortFields = [
    "first_seen",
    "last_seen",
    "pageviews",
    "sessions",
    "events",
  ];
  const actualSortBy = validSortFields.includes(sortBy) ? sortBy : "last_seen";
  const actualSortOrder = sortOrder === "asc" ? "ASC" : "DESC";

  const filterStatement = getFilterStatement(filters);

  // Query to get user data with pagination
  const query = `
SELECT
    user_id,
    argMax(country, timestamp) AS country,
    argMax(browser, timestamp) AS browser,
    argMax(operating_system, timestamp) AS operating_system,
    argMax(device_type, timestamp) AS device_type,
    count() AS pageviews,
    countIf(type = 'custom_event') AS events,
    count(distinct session_id) AS sessions,
    max(timestamp) AS last_seen,
    min(timestamp) AS first_seen
FROM pageviews
WHERE
    site_id = ${site}
    ${filterStatement}
    ${getTimeStatement({
      date: { startDate, endDate, timezone },
    })}
GROUP BY
    user_id
ORDER BY ${actualSortBy} ${actualSortOrder}
LIMIT ${pageSizeNum} OFFSET ${offset}
  `;

  // Query to get total count
  const countQuery = `
SELECT
    count(DISTINCT user_id) AS total_count
FROM pageviews
WHERE
    site_id = ${site}
    ${filterStatement}
    ${getTimeStatement({
      date: { startDate, endDate, timezone },
    })}
  `;

  try {
    // Execute both queries in parallel
    const [result, countResult] = await Promise.all([
      clickhouse.query({
        query,
        format: "JSONEachRow",
      }),
      clickhouse.query({
        query: countQuery,
        format: "JSONEachRow",
      }),
    ]);

    const data = await processResults<GetUsersResponse[number]>(result);
    const countData = await processResults<{ total_count: number }>(
      countResult
    );
    const totalCount = countData[0]?.total_count || 0;

    return res.send({
      data,
      totalCount,
      page: pageNum,
      pageSize: pageSizeNum,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).send({ error: "Failed to fetch users" });
  }
}
