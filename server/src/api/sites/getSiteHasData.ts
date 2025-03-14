import { FastifyReply } from "fastify";

import { FastifyRequest } from "fastify";
import clickhouse from "../../db/clickhouse/clickhouse.js";

export async function getSiteHasData(
  req: FastifyRequest<{ Params: { site: string } }>,
  reply: FastifyReply
) {
  try {
    const sites: { count: number }[] = await clickhouse
      .query({
        query: `SELECT count(*) as count FROM pageviews WHERE site_id = ${req.params.site}`,
        format: "JSONEachRow",
      })
      .then((res) => res.json());

    return reply.status(200).send(sites[0].count > 0);
  } catch (err) {
    return reply.status(500).send(String(err));
  }
}
