import { FastifyRequest, FastifyReply } from "fastify";
import { getSession } from "../lib/auth-utils.js";
import { getUserEventLimit } from "./sites/getSites.js";
import { db } from "../db/postgres/postgres.js";
import { user, subscription } from "../db/postgres/schema.js";
import { eq, and, inArray } from "drizzle-orm";
import { STRIPE_PRICES } from "../lib/const.js";

// Define the plan interface
interface StripePlan {
  name: string;
  priceId: string;
  interval: string;
  limits: {
    events: number;
    [key: string]: any;
  };
}

export async function getUserSubscription(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const session = await getSession(req);
  if (!session) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  try {
    // Get user's monthly event count
    const userData = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      columns: {
        monthlyEventCount: true,
        overMonthlyLimit: true,
      },
    });

    // Find user's active subscription
    const userSubscription = await db
      .select()
      .from(subscription)
      .where(
        and(
          eq(subscription.referenceId, session.user.id),
          inArray(subscription.status, ["active", "trialing"])
        )
      )
      .limit(1);

    // Get plan details
    let subscriptionPlanDetails = null;
    const eventLimit = await getUserEventLimit(session.user.id);

    if (userSubscription.length > 0) {
      const subData = userSubscription[0];
      // Find detailed plan information from STRIPE_PRICES
      const planDetails = STRIPE_PRICES.find(
        (plan: StripePlan) => plan.name === subData.plan
      );

      subscriptionPlanDetails = {
        ...subData,
        planDetails: planDetails || null,
      };
    }

    // Construct the response
    const response = {
      ...subscriptionPlanDetails,
      monthlyEventCount: userData?.monthlyEventCount || 0,
      overMonthlyLimit: userData?.overMonthlyLimit || false,
      monthlyEventLimit: eventLimit,
    };

    return reply.status(200).send(response);
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    return reply.status(500).send({
      error: "Failed to fetch subscription details",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
