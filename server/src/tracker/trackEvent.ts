import { FastifyReply, FastifyRequest } from "fastify";
import {
  BaseTrackingPayload,
  createBasePayload,
  getExistingSession,
  processTrackingEvent,
} from "./trackingUtils.js";

// Extended type for tracking payloads with event data
export interface EventTrackingPayload extends BaseTrackingPayload {
  type: "pageview" | "custom_event";
  event_name?: string; // Required for custom_event, optional for pageview
  properties?: string;
}

// Unified handler for all events (pageviews and custom events)
export async function trackEvent(
  request: FastifyRequest<{ Body: EventTrackingPayload }>,
  reply: FastifyReply
) {
  try {
    // Check if the site has exceeded its monthly limit
    // if (isSiteOverLimit(request.body.site_id)) {
    //   console.log(
    //     `[Tracking] Skipping event for site ${request.body.site_id} - over monthly limit`
    //   );
    //   return reply
    //     .status(200)
    //     .send("Site over monthly limit, event not tracked");
    // }

    // Validate event data based on type
    const eventType = request.body.type || "pageview";

    // Ensure custom events have an event name
    if (eventType === "custom_event" && !request.body.event_name) {
      return reply.status(400).send({
        success: false,
        error: "Event name is required for custom events",
      });
    }

    // Create base payload for the event
    const payload = createBasePayload(
      request,
      eventType as "pageview" | "custom_event"
    );

    // Get existing session
    const existingSession = await getExistingSession(payload.userId);

    // Process the event (isPageview = true for pageview events)
    await processTrackingEvent(
      payload,
      existingSession,
      eventType === "pageview"
    );

    return reply.status(200).send({
      success: true,
    });
  } catch (error) {
    console.error("Error tracking event:", error);
    return reply.status(500).send({
      success: false,
      error: "Failed to track event",
    });
  }
}
