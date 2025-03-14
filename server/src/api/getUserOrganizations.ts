import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "../db/postgres/postgres.js";
import { eq } from "drizzle-orm";
import { member, organization } from "../db/postgres/schema.js";
import { getSession } from "../lib/auth-utils.js";

export const getUserOrganizations = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const session = await getSession(request);

    if (!session?.user.id) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const userOrganizations = await db
      .select({
        organization: organization,
        role: member.role,
      })
      .from(member)
      .innerJoin(organization, eq(member.organizationId, organization.id))
      .where(eq(member.userId, session?.user.id));

    return reply.send({
      success: true,
      data: userOrganizations,
    });
  } catch (error) {
    console.error("Error fetching user organizations:", error);
    return reply.status(500).send({
      success: false,
      error: "Failed to fetch user organizations",
    });
  }
};
