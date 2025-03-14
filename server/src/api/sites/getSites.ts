import { and, eq, inArray } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../db/postgres/postgres.js";
import { member, user, subscription } from "../../db/postgres/schema.js";
import { getSitesUserHasAccessTo } from "../../lib/auth-utils.js";
import { STRIPE_PRICES } from "../../lib/const.js";

// Default event limit for users without an active subscription
const DEFAULT_EVENT_LIMIT = 20_000;

/**
 * Get subscription event limit for a user
 */
export async function getUserEventLimit(userId: string): Promise<number> {
  try {
    // Find active subscription
    const userSubscription = await db
      .select()
      .from(subscription)
      .where(
        and(
          eq(subscription.referenceId, userId),
          inArray(subscription.status, ["active", "trialing"])
        )
      )
      .limit(1);

    if (!userSubscription.length) {
      return DEFAULT_EVENT_LIMIT;
    }

    // Find the plan in STRIPE_PLANS
    const plan = STRIPE_PRICES.find((p) => p.name === userSubscription[0].plan);
    return plan ? plan.limits.events : DEFAULT_EVENT_LIMIT;
  } catch (error) {
    console.error(`Error getting event limit for user ${userId}:`, error);
    return DEFAULT_EVENT_LIMIT;
  }
}

export async function getSites(req: FastifyRequest, reply: FastifyReply) {
  try {
    // Get sites the user has access to
    const sitesData = await getSitesUserHasAccessTo(req);

    // Enhance sites data with usage limit information
    const enhancedSitesData = await Promise.all(
      sitesData.map(async (site) => {
        // Skip if no organization ID
        if (!site.organizationId) {
          return {
            ...site,
            overMonthlyLimit: false,
            eventLimit: DEFAULT_EVENT_LIMIT,
            isOwner: false,
          };
        }

        // Get the organization owner
        const orgOwner = await db
          .select({ userId: member.userId })
          .from(member)
          .where(
            and(
              eq(member.organizationId, site.organizationId),
              eq(member.role, "owner")
            )
          )
          .limit(1);

        if (!orgOwner.length) {
          return {
            ...site,
            overMonthlyLimit: false,
            eventLimit: DEFAULT_EVENT_LIMIT,
            isOwner: false,
          };
        }

        // Check if the current user is the organization owner
        const isOwner = orgOwner[0].userId === req.user?.id;

        // Get the user data to check if they're over limit
        const userData = await db
          .select({
            overMonthlyLimit: user.overMonthlyLimit,
            monthlyEventCount: user.monthlyEventCount,
          })
          .from(user)
          .where(eq(user.id, orgOwner[0].userId))
          .limit(1);

        if (!userData.length) {
          return {
            ...site,
            overMonthlyLimit: false,
            eventLimit: DEFAULT_EVENT_LIMIT,
            isOwner,
          };
        }

        // Get the user's event limit from their subscription
        const eventLimit = await getUserEventLimit(orgOwner[0].userId);

        // Return site with usage limit info
        return {
          ...site,
          overMonthlyLimit: userData[0].overMonthlyLimit || false,
          monthlyEventCount: userData[0].monthlyEventCount || 0,
          eventLimit,
          isOwner,
        };
      })
    );

    return reply.status(200).send(enhancedSitesData);
  } catch (err) {
    console.error("Error in getSites:", err);
    return reply.status(500).send(String(err));
  }
}
