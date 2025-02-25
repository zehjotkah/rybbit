import { FastifyReply, FastifyRequest } from "fastify";
import clickhouse from "../db/clickhouse/clickhouse.js";
import { GenericRequest } from "./types.js";
import {
  getFilterStatement,
  getTimeStatement,
  processResults,
} from "./utils.js";

type GetReferrersResponse = {
  referrer: string;
  count: number;
  percentage: number;
}[];

export async function getReferrers(
  {
    query: { startDate, endDate, timezone, site, filters },
  }: FastifyRequest<GenericRequest>,
  res: FastifyReply
) {
  const filterStatement = getFilterStatement(filters);

  const query = `
    SELECT
      domainWithoutWWW(referrer) AS referrer,
      COUNT(*) as count,
      ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
    FROM pageviews
    WHERE
        site_id = ${site}
        ${filterStatement}
        ${getTimeStatement(startDate, endDate, timezone)}
    GROUP BY referrer 
    ORDER BY count desc
    LIMIT 100;
  `;

  try {
    const result = await clickhouse.query({
      query,
      format: "JSONEachRow",
    });

    const data = await processResults<GetReferrersResponse[number]>(result);
    return res.send({ data });
  } catch (error) {
    console.error("Error fetching referrers:", error);
    return res.status(500).send({ error: "Failed to fetch referrers" });
  }
}
