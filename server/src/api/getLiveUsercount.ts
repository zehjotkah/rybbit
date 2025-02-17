import { FastifyReply, FastifyRequest } from "fastify";
import { sql } from "../db/postgres/postgres.js";

export const getLiveUsercount = async (
  { params: { site } }: FastifyRequest<{ Params: { site: string } }>,
  res: FastifyReply
) => {
  const result =
    await sql`SELECT COUNT(*) FROM active_sessions WHERE site_id = ${site}`;

  return res.send({ count: result[0].count });
};
