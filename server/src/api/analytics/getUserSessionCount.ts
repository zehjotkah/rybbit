import { FastifyReply, FastifyRequest } from "fastify";
import clickhouse from "../../db/clickhouse/clickhouse.js";
import { getTimeStatement, processResults } from "./utils.js";
import { getUserHasAccessToSitePublic } from "../../lib/auth-utils.js";

export interface GetUserSessionCountRequest {
  Params: {
    site: string;
  };
  Querystring: {
    userId?: string;
    startDate?: string;
    endDate?: string;
    timezone?: string;
  };
}

export type GetUserSessionCountResponse = {
  date: string;
  sessions: number;
}[];

export async function getUserSessionCount(
  req: FastifyRequest<GetUserSessionCountRequest>,
  res: FastifyReply
) {
  const { site } = req.params;
  const { userId, startDate, endDate, timezone } = req.query;

  const userHasAccessToSite = await getUserHasAccessToSitePublic(req, site);
  if (!userHasAccessToSite) {
    return res.status(403).send({ error: "Forbidden" });
  }

  if (!userId) {
    return res.status(400).send({ error: "userId is required" });
  }

  // Generate time statement
  const timeStatement = getTimeStatement({
    date: {
      startDate: startDate || "",
      endDate: endDate || "",
      timezone: timezone || "UTC",
      table: "sessions",
    },
  });

  const query = `
    SELECT
      toDate(session_start, '${timezone || "UTC"}') as date,
      count() as sessions
    FROM sessions
    WHERE
      site_id = ${site}
      AND user_id = '${userId}'
      ${timeStatement}
    GROUP BY date
    ORDER BY date ASC
  `;

  try {
    const result = await clickhouse.query({
      query,
      format: "JSONEachRow",
    });

    const data = await processResults<GetUserSessionCountResponse[number]>(
      result
    );

    return res.send({
      data,
    });
  } catch (error) {
    console.error("Error fetching user session count:", error);
    return res
      .status(500)
      .send({ error: "Failed to fetch user session count" });
  }
}
