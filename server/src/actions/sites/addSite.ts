import { FastifyReply } from "fastify";

import { FastifyRequest } from "fastify";

export function addSite(
  request: FastifyRequest<{ Params: { domain: string } }>,
  reply: FastifyReply
) {
  const { domain } = request.params;
  const { user } = request.user;

  console.info(request);

  //   if (!user) {
  //     return reply.status(401).send({ error: "Unauthorized" });
  //   }
}
