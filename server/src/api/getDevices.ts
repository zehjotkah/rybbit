import { FastifyReply, FastifyRequest } from "fastify";
import clickhouse from "../db/clickhouse/clickhouse.js";
import { GenericRequest } from "./types.js";
import {
  getFilterStatement,
  getTimeStatement,
  processResults,
} from "./utils.js";

type GetDevicesResponse = {
  device_type: string;
  count: number;
  percentage: number;
}[];

export async function getDevices(
  {
    query: { startDate, endDate, timezone, site, filters },
  }: FastifyRequest<GenericRequest>,
  res: FastifyReply
) {
  const filterStatement = getFilterStatement(filters);

  const query = `
    SELECT
      device_type,
      COUNT(*) as count,
      ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
    FROM pageviews
    WHERE
        site_id = ${site}
        ${filterStatement}
        ${getTimeStatement(startDate, endDate, timezone)}
    GROUP BY device_type ORDER BY count desc;
  `;

  try {
    const result = await clickhouse.query({
      query,
      format: "JSONEachRow",
    });

    const data = await processResults<GetDevicesResponse[number]>(result);
    return res.send({ data });
  } catch (error) {
    console.error("Error fetching devices:", error);
    return res.status(500).send({ error: "Failed to fetch devices" });
  }
}
