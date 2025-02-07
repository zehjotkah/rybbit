import { FastifyReply, FastifyRequest } from "fastify";
import clickhouse from "../db/clickhouse/clickhouse";
import { GenericRequest } from "./types";
import { getTimeStatement, processResults } from "./utils";

type GetOverviewResponse = {
  sessions: number;
  pageviews: number;
  users: number;
};

export async function getOverview(
  { query: { startDate, endDate, timezone } }: FastifyRequest<GenericRequest>,
  res: FastifyReply
) {
  const query = `
    SELECT
        COUNT(DISTINCT(session_id)) AS sessions,
        COUNT(*) AS pageviews,
        COUNT(DISTINCT(user_id)) AS users
    FROM
        pageviews
    WHERE
    ${getTimeStatement(startDate, endDate, timezone)}
  `;

  try {
    const result = await clickhouse.query({
      query,
      format: "JSONEachRow",
    });

    const data = await processResults<GetOverviewResponse>(result);
    return res.send({ data: data[0] });
  } catch (error) {
    console.error("Error fetching overview:", error);
    return res.status(500).send({ error: "Failed to fetch overview" });
  }
}
