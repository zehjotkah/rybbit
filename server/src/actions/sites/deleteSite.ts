import { FastifyReply } from "fastify";

import { FastifyRequest } from "fastify";
import { sql } from "../../db/postgres/postgres.js";
import { loadAllowedDomains } from "../../lib/allowedDomains.js";
import clickhouse from "../../db/clickhouse/clickhouse.js";

export async function deleteSite(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  await sql`DELETE FROM sites WHERE site_id = ${id}`;
  // await clickhouse.query({
  //   query: `DELETE FROM pageviews WHERE site_id = ${id}`,
  // });
  await loadAllowedDomains();

  return reply.status(200).send();
}
