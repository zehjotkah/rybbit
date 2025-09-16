import { FastifyReply, FastifyRequest } from "fastify";
import { siteConfig } from "../../lib/siteConfig.js";

export async function getTrackingConfig(request: FastifyRequest<{ Params: { siteId: string } }>, reply: FastifyReply) {
  try {
    const config = await siteConfig.getConfig(request.params.siteId);
    return reply.send({
      sessionReplay: config?.sessionReplay,
      webVitals: config?.webVitals,
      trackErrors: config?.trackErrors,
      trackOutbound: config?.trackOutbound,
      trackUrlParams: config?.trackUrlParams,
      trackInitialPageView: config?.trackInitialPageView,
      trackSpaNavigation: config?.trackSpaNavigation,
    });
  } catch (error) {
    console.error("Error getting tracking config:", error);
    return reply.status(500).send({ error: "Failed to get tracking configuration" });
  }
}
