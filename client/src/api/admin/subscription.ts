import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "../../lib/const";
import { authedFetch } from "../utils";

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

export type SubscriptionWithUsage = Subscription & {
  monthlyEventCount: number;
  overMonthlyLimit: boolean;
  monthlyEventLimit: number;
};

export function useSubscriptionWithUsage() {
  return useQuery<SubscriptionWithUsage>({
    queryKey: ["subscriptionWithUsage"],
    queryFn: async () => {
      const res = await authedFetch(`${BACKEND_URL}/user/subscription`);
      return res.json();
    },
  });
}
