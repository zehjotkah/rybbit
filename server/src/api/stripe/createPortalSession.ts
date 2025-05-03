import { FastifyReply, FastifyRequest } from "fastify";
import { stripe } from "../../lib/stripe.js";
import { db } from "../../db/postgres/postgres.js";
import { user as userSchema } from "../../db/postgres/schema.js";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

interface PortalRequestBody {
  returnUrl: string;
  flowType?:
    | "subscription_update"
    | "subscription_cancel"
    | "payment_method_update";
}

export async function createPortalSession(
  request: FastifyRequest<{ Body: PortalRequestBody }>,
  reply: FastifyReply
) {
  const { returnUrl, flowType } = request.body;
  const userId = request.user?.id;

  if (!userId) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  if (!returnUrl) {
    return reply
      .status(400)
      .send({ error: "Missing required parameter: returnUrl" });
  }

  try {
    // 1. Find the user in your database
    const userResult = await db
      .select({
        stripeCustomerId: userSchema.stripeCustomerId,
      })
      .from(userSchema)
      .where(eq(userSchema.id, userId))
      .limit(1);

    const user = userResult[0];

    if (!user || !user.stripeCustomerId) {
      return reply
        .status(404)
        .send({ error: "User or Stripe customer ID not found" });
    }

    // 2. Create a Stripe Billing Portal Session, with optional direct flow
    const sessionConfig: Stripe.BillingPortal.SessionCreateParams = {
      customer: user.stripeCustomerId,
      return_url: returnUrl, // The user will be redirected here after managing their billing
    };

    // If a specific flow is requested, add it to the configuration
    if (flowType) {
      if (flowType === "subscription_update") {
        // For subscription_update flow, we need to fetch the subscription ID first
        const subscriptions = await (stripe as Stripe).subscriptions.list({
          customer: user.stripeCustomerId,
          status: "active",
          limit: 1,
        });

        if (subscriptions.data.length === 0) {
          return reply
            .status(404)
            .send({ error: "No active subscription found" });
        }

        const subscriptionId = subscriptions.data[0].id;

        sessionConfig.flow_data = {
          type: "subscription_update",
          subscription_update: {
            subscription: subscriptionId,
          },
        };
      } else if (flowType === "subscription_cancel") {
        // For subscription_cancel flow, we need to fetch the subscription ID first
        const subscriptions = await (stripe as Stripe).subscriptions.list({
          customer: user.stripeCustomerId,
          status: "active",
          limit: 1,
        });

        if (subscriptions.data.length === 0) {
          return reply
            .status(404)
            .send({ error: "No active subscription found" });
        }

        const subscriptionId = subscriptions.data[0].id;

        sessionConfig.flow_data = {
          type: "subscription_cancel",
          subscription_cancel: {
            subscription: subscriptionId,
          },
        };
      } else if (flowType === "payment_method_update") {
        sessionConfig.flow_data = {
          type: "payment_method_update",
        };
      }
    }

    const portalSession = await (
      stripe as Stripe
    ).billingPortal.sessions.create(sessionConfig);

    // 3. Return the Billing Portal Session URL
    return reply.send({ portalUrl: portalSession.url });
  } catch (error: any) {
    console.error("Stripe Portal Session Error:", error);
    return reply.status(500).send({
      error: "Failed to create Stripe portal session",
      details: error.message,
    });
  }
}
