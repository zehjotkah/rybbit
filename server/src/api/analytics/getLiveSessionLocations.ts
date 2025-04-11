import { FastifyRequest, FastifyReply } from "fastify";
import clickhouse from "../../db/clickhouse/clickhouse.js";
import { processResults } from "./utils.js";

export async function getLiveSessionLocations(
  req: FastifyRequest<{
    Params: {
      site: string;
    };
    Querystring: {
      time: number;
    };
  }>,
  res: FastifyReply
) {
  const { site } = req.params;

  const result = await clickhouse.query({
    query: `
WITH stuff AS (
    SELECT
        session_id,
        any(lat) AS lat,
        any(lon) AS lon,
        any(city) AS city
    FROM
        pageviews
    WHERE
        site_id = {site:Int32}
        AND timestamp > now() - interval '{time:Int32} minute'
    GROUP BY
        session_id
)
SELECT
    lat,
    lon,
    city,
    count() as count
from
    stuff
GROUP BY
    lat,
    lon,
    city`,
    query_params: {
      site,
      time: req.query.time,
    },
    format: "JSONEachRow",
  });

  const data = await processResults<{
    lat: number;
    lon: number;
    count: number;
    city: string;
  }>(result);

  return res.status(200).send({ data });
}
