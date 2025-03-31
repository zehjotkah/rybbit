import { FastifyRequest, FastifyReply } from "fastify";
import clickhouse from "../db/clickhouse/clickhouse.js";
import { processResults } from "./utils.js";

export async function getLiveSessionLocations(
  req: FastifyRequest<{
    Params: {
      siteId: string;
    };
  }>,
  res: FastifyReply
) {
  const { siteId } = req.params;

  const result = await clickhouse.query({
    query: `
WITH stuff AS (
    SELECT
        session_id,
        any(lat) AS lat,
        any(lon) AS lon
    FROM
        pageviews
    WHERE
        site_id = {siteId:Int32}
        AND timestamp > now() - interval '30 minute'
    GROUP BY
        session_id
)
SELECT
    lat,
    lon,
    count() as count
from
    stuff
GROUP BY
    lat,
    lon`,
    query_params: {
      siteId: Number(siteId),
    },
    format: "JSONEachRow",
  });

  const data = await processResults<{
    lat: number;
    lon: number;
    count: number;
  }>(result);

  return res.status(200).send({ data });
}
