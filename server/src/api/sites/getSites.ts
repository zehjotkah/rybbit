import { FastifyReply } from "fastify";

import { FastifyRequest } from "fastify";
import { sql } from "../../db/postgres/postgres.js";

export async function getSites(_: FastifyRequest, reply: FastifyReply) {
  try {
    const sites = await sql`SELECT * FROM sites`;
    return reply.status(200).send({ data: sites });
  } catch (err) {
    return reply.status(500).send({ error: String(err) });
  }
}
