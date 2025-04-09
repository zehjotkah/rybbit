import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "../../db/postgres/postgres.js";
import { sites } from "../../db/postgres/schema.js";
import { eq } from "drizzle-orm";
import clickhouse from "../../db/clickhouse/clickhouse.js";

export async function getSiteHasData(
  request: FastifyRequest<{ Params: { site: string } }>,
  reply: FastifyReply
) {
  const { site } = request.params;

  try {
    // Get site information including public status
    const siteInfo = await db.query.sites.findFirst({
      where: eq(sites.siteId, Number(site)),
      columns: {
        public: true,
      },
    });

    // Check if site has data using original method
    const pageviewsData: { count: number }[] = await clickhouse
      .query({
        query: `SELECT count(*) as count FROM pageviews WHERE site_id = ${site}`,
        format: "JSONEachRow",
      })
      .then((res) => res.json());

    const hasData = pageviewsData[0].count > 0;

    return {
      hasData,
      public: siteInfo?.public || false,
    };
  } catch (error) {
    console.error("Error checking if site has data:", error);
    return reply.status(500).send({ error: "Internal server error" });
  }
}
