import { FastifyReply, FastifyRequest } from "fastify";
import clickhouse from "../db/clickhouse/clickhouse.js";
import { GenericRequest } from "./types.js";
import {
  getFilterStatement,
  getTimeStatement,
  processResults,
} from "./utils.js";

type GetBrowsersResponse = {
  browser: string;
  count: number;
  percentage: number;
}[];

export async function getBrowsers(
  {
    query: { startDate, endDate, timezone, site, filters },
  }: FastifyRequest<GenericRequest>,
  res: FastifyReply
) {
  const filterStatement = getFilterStatement(filters);

  const query = `
    SELECT
      browser,
      COUNT(*) as count,
      ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
    FROM pageviews
    WHERE
        site_id = ${site}
        ${filterStatement}
        ${getTimeStatement(startDate, endDate, timezone)}
    GROUP BY browser ORDER BY count desc;
  `;

  try {
    const result = await clickhouse.query({
      query,
      format: "JSONEachRow",
    });

    const data = await processResults<GetBrowsersResponse[number]>(result);
    return res.send({ data });
  } catch (error) {
    console.error("Error fetching browsers:", error);
    return res.status(500).send({ error: "Failed to fetch browsers" });
  }
}
