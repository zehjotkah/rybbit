import { FastifyReply, FastifyRequest } from "fastify";
import clickhouse from "../db/clickhouse/clickhouse.js";
import { GenericRequest } from "./types.js";
import {
  geSqlParam,
  getFilterStatement,
  getTimeStatement,
  processResults,
} from "./utils.js";

type GetSingleColResponse = {
  value: string;
  count: number;
  percentage: number;
}[];

export async function getSingleCol(
  {
    query: { startDate, endDate, timezone, site, filters, parameter, limit },
  }: FastifyRequest<GenericRequest>,
  res: FastifyReply
) {
  const filterStatement = getFilterStatement(filters);

  const query = `
    SELECT
      ${geSqlParam(parameter)} as value,
      COUNT(*) as count,
      ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
    FROM pageviews
    WHERE
        site_id = ${site}
        ${filterStatement}
        ${getTimeStatement(startDate, endDate, timezone)}
    GROUP BY value ORDER BY count desc
     ${limit ? `LIMIT ${limit}` : ""};
  `;

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
