import { Clock, Shield } from "lucide-react";
import { STRIPE_PRICES } from "@/lib/stripe";

// Define interfaces for plan data
export interface PlanTemplate {
  id: string;
  name: string;
  price: string;
  interval: string;
  description: string;
  features: string[];
  color: string;
  icon: React.ReactNode;
}

// Helper to get the appropriate plan details based on subscription plan name
export const getPlanDetails = (
  planName: string | undefined
): PlanTemplate | null => {
  if (!planName) return null;

  const tier = planName.startsWith("basic") ? "basic" : "free";
  const stripePlan = STRIPE_PRICES.find((p) => p.name === planName);

  const planTemplates: Record<string, PlanTemplate> = {
    free: {
      id: "free",
      name: "Free",
      price: "$0",
      interval: "month",
      description: "Get started with basic analytics",
      features: [
        "20,000 events per month",
        "Basic analytics",
        "7-day data retention",
        "Community support",
      ],
      color:
        "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900",
      icon: <Clock className="h-5 w-5" />,
    },
    basic: {
      id: "basic",
      name: "Pro",
      price: "$19+",
      interval: "month",
      description: "Advanced analytics for growing projects",
      features: [
        "Advanced analytics features",
        "14-day data retention",
        "Priority support",
      ],
      color:
        "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-800 dark:to-emerald-800",
      icon: <Shield className="h-5 w-5" />,
    },
  };

  const plan = { ...planTemplates[tier] };

  if (stripePlan) {
    plan.price = `$${stripePlan.price}`;
    plan.interval = stripePlan.interval;

    // Add event limit as first feature
    plan.features = [
      `${stripePlan.limits.events.toLocaleString()} events per month`,
      ...plan.features,
    ];
  }

  return plan;
};

// Helper function to format dates
export const formatDate = (dateString: string | Date | null | undefined) => {
  if (!dateString) return "N/A";
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};
