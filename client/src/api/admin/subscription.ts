import { useQuery } from "@tanstack/react-query";
import { authClient } from "../../lib/auth";

export type Subscription = {
  id: string;
  status: "active" | "trialing" | "canceled" | "incomplete" | "past_due";
  plan: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  trialStart?: Date;
  trialEnd?: string | null | Date;
  createdAt?: Date;
  updatedAt?: Date;
  cancelAt?: string | null;
  canceledAt?: Date | null;
  periodStart?: Date | string;
  periodEnd?: Date | string;
  cancelAtPeriodEnd: boolean;
  referenceId?: string;
  limits?: {
    events: number;
    [key: string]: any;
  };
  seats?: number;
  metadata?: Record<string, any>;
};

export function useSubscription() {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      try {
        const { data, error } = await authClient.subscription.list();

        if (error) {
          throw new Error(error.message);
        }

        // Find the active subscription
        const activeSubscription =
          data?.find(
            (sub) => sub.status === "active" || sub.status === "trialing"
          ) || null;

        // Ensure the returned data has the correct shape for our frontend
        return activeSubscription as Subscription | null;
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
        throw error;
      }
    },
  });
}
