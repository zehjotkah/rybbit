import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "../../db/postgres/postgres.js";
import { sites } from "../../db/postgres/schema.js";
import { eq } from "drizzle-orm";

interface ChangeSitePublicRequest {
  Body: {
    siteId: number;
    isPublic: boolean;
  };
}

export async function changeSitePublic(
  request: FastifyRequest<ChangeSitePublicRequest>,
  reply: FastifyReply
) {
  const { siteId, isPublic } = request.body;
  const userId = request.user?.id;

  if (!userId) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  try {
    // Fetch site to check ownership
    const site = await db.query.sites.findFirst({
      where: eq(sites.siteId, siteId),
    });

    if (!site) {
      return reply.status(404).send({ error: "Site not found" });
    }

    // Check if user is authorized to modify the site
    if (site.createdBy !== userId) {
      return reply.status(403).send({ error: "Forbidden" });
    }

    // Update site public status
    await db
      .update(sites)
      .set({
        public: isPublic,
        updatedAt: new Date(),
      })
      .where(eq(sites.siteId, siteId));

    return reply.status(200).send({ success: true });
  } catch (error) {
    console.error("Error changing site public status:", error);
    return reply.status(500).send({ error: "Internal server error" });
  }
}
