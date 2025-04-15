"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { STRIPE_PRICES } from "@/lib/stripe";
import { AlertCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSubscriptionWithUsage } from "../../../api/admin/subscription";
import { authClient } from "../../../lib/auth";
import { ChangePlanDialog } from "./components/ChangePlanDialog";
import { CurrentPlanCard } from "./components/CurrentPlanCard";
import { ErrorDialog } from "./components/ErrorDialog";
import { HelpSection } from "./components/HelpSection";
import { PlanFeaturesCard } from "./components/PlanFeaturesCard";
import { DEFAULT_EVENT_LIMIT } from "./utils/constants";
import { getPlanDetails, formatDate } from "./utils/planUtils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function SubscriptionPage() {
  const router = useRouter();

  const {
    data: activeSubscription,
    isLoading,
    error: subscriptionError,
    refetch,
  } = useSubscriptionWithUsage();

  console.info("activeSubscription", activeSubscription);

  // State variables
  const [errorType, setErrorType] = useState<"cancel" | "resume">("cancel");
  const [showConfigError, setShowConfigError] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Current usage - in a real app, you would fetch this from your API
  const currentUsage = activeSubscription?.monthlyEventCount || 0;

  const handleCancelSubscription = async () => {
    try {
      setIsProcessing(true);
      setErrorType("cancel");
      setActionError(null);

      // Don't pass referenceId if it's the same as the user ID
      // This is because Better Auth defaults to the user ID when no referenceId is provided
      const { error } = await authClient.subscription.cancel({
        returnUrl: globalThis.location.href,
      });

      if (error) {
        // Check for specific error about Stripe portal configuration
        if (
          error.message?.includes("No configuration provided") ||
          error.message?.includes("default configuration has not been created")
        ) {
          // Show the error dialog instead of an alert
          setShowConfigError(true);

          // Log detailed instructions for developers/admins
          console.error(
            "Stripe Customer Portal not configured. Admin needs to set up the Customer Portal at https://dashboard.stripe.com/test/settings/billing/portal"
          );
        } else {
          setActionError(
            error.message ||
              "An error occurred while canceling the subscription"
          );
        }
      }
      // The user will be redirected to Stripe's billing portal if successful
    } catch (err: any) {
      console.error("Failed to cancel subscription:", err);
      setActionError(err.message || "Failed to cancel subscription");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpgradeSubscription = async (planId: string) => {
    try {
      setIsProcessing(true);
      setActionError(null);

      // Don't pass referenceId if it's the same as the user ID
      // Better Auth defaults to the user ID when no referenceId is provided
      const { error } = await authClient.subscription.upgrade({
        plan: planId,
        cancelUrl: globalThis.location.origin + "/settings/subscription",
        successUrl: globalThis.location.origin + "/auth/subscription/success",
      });

      if (error) {
        setActionError(
          error.message || "An error occurred while changing the plan"
        );
      }
      // The user will be redirected to Stripe checkout if successful
    } catch (err: any) {
      console.error("Failed to change plan:", err);
      setActionError(err.message || "Failed to change plan");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResumeSubscription = async () => {
    try {
      setIsProcessing(true);
      setErrorType("resume");
      setActionError(null);

      // Check if we have the plan information
      if (!activeSubscription?.plan) {
        setActionError(
          "Cannot resume subscription: plan information is missing"
        );
        setShowConfigError(true);
        return;
      }

      // Directly use the upgrade method to take the user to Stripe checkout
      // with the same plan they currently have
      const { error } = await authClient.subscription.upgrade({
        plan: activeSubscription.plan,
        successUrl: globalThis.location.origin + "/auth/subscription/success",
        cancelUrl: globalThis.location.origin + "/settings/subscription",
      });

      if (error) {
        setActionError(
          error.message || "An error occurred while resuming the subscription"
        );
        setShowConfigError(true);
      }
      // The user will be redirected to Stripe checkout if successful
    } catch (err: any) {
      console.error("Failed to resume subscription:", err);
      setActionError(err.message || "Failed to resume subscription");
      setShowConfigError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShowUpgradeOptions = () => {
    setShowUpgradeDialog(true);
    setActionError(null);
  };

  // Get information about current plan if there's an active subscription
  const currentPlan = activeSubscription
    ? getPlanDetails(activeSubscription.plan)
    : null;

  // Determine if the current plan is annual
  const isAnnualPlan = activeSubscription?.plan?.includes("-annual") || false;

  // Find the next tier plans for upgrade options
  const getCurrentTierPrices = () => {
    if (!activeSubscription?.plan) return [];

    // Return all available plans for switching, regardless of interval
    // The ChangePlanDialog will handle filtering by interval
    return STRIPE_PRICES.sort((a, b) => {
      // First sort by plan type (basic only now)

      // Then sort by interval (month first, then year)
      if (a.interval === "month" && b.interval === "year") return -1;
      if (a.interval === "year" && b.interval === "month") return 1;

      // Then sort by event limit
      return a.limits.events - b.limits.events;
    });
  };

  const upgradePlans = getCurrentTierPrices();

  const errorMessage = subscriptionError?.message || actionError || null;

  // Get event limit from the subscription plan
  const getEventLimit = () => {
    if (!activeSubscription?.plan) return DEFAULT_EVENT_LIMIT;

    const plan = STRIPE_PRICES.find((p) => p.name === activeSubscription.plan);
    return plan?.limits.events || DEFAULT_EVENT_LIMIT;
  };

  const eventLimit = getEventLimit();
  const usagePercentage = (currentUsage / eventLimit) * 100;

  // Format the price with the correct interval
  const formatPriceWithInterval = (price: number, interval: string) => {
    return `$${price}/${interval === "year" ? "year" : "month"}`;
  };

  // Get formatted price for display
  const getFormattedPrice = () => {
    if (!activeSubscription?.plan) return "$0/month";

    const plan = STRIPE_PRICES.find((p) => p.name === activeSubscription.plan);
    if (!plan) return "$0/month";

    return formatPriceWithInterval(plan.price, plan.interval);
  };

  // Format the renewal date with appropriate text
  const formatRenewalDate = () => {
    if (!activeSubscription?.periodEnd) return "N/A";

    const formattedDate = formatDate(activeSubscription.periodEnd);

    if (activeSubscription.status === "canceled") {
      return `Expires on ${formattedDate}`;
    }

    if (activeSubscription.cancelAtPeriodEnd) {
      return `Ends on ${formattedDate}`;
    }

    return isAnnualPlan
      ? `Renews annually on ${formattedDate}`
      : `Renews monthly on ${formattedDate}`;
  };

  return (
    <div className="container py-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your subscription and billing information
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/subscribe")}>
          View Plans
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-20 w-full mt-4" />
            </div>
          </CardContent>
        </Card>
      ) : errorMessage ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : !activeSubscription?.plan ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Free Plan</CardTitle>
              <CardDescription>
                You are currently on the Free Plan. Upgrade to unlock premium
                features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium">Plan</h3>
                    <p className="text-lg font-bold">Free</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      $0/month
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Renewal Date</h3>
                    <p className="text-lg font-bold">Never expires</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium mb-2">Usage</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Events</span>
                        <span className="text-sm">
                          {currentUsage.toLocaleString()} /{" "}
                          {DEFAULT_EVENT_LIMIT.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={(currentUsage / DEFAULT_EVENT_LIMIT) * 100}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push("/subscribe")}>
                Upgrade Plan <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <PlanFeaturesCard currentPlan={getPlanDetails("free")} />

          <HelpSection router={router} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>
                    {currentPlan?.name || "Current Plan"}
                    {isAnnualPlan && (
                      <Badge className="ml-2 bg-emerald-500 text-white">
                        Annual
                      </Badge>
                    )}
                    {activeSubscription.cancelAtPeriodEnd && (
                      <Badge className="ml-2 bg-orange-500 text-white">
                        Canceling
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {activeSubscription.cancelAtPeriodEnd
                      ? "Your subscription will be canceled at the end of the current billing period."
                      : activeSubscription.status === "active"
                      ? "Your subscription is active."
                      : activeSubscription.status === "canceled"
                      ? "Your subscription has been canceled but is still active until the end of the billing period."
                      : "Your subscription is inactive."}
                  </CardDescription>
                </div>
                <div>
                  {activeSubscription.status === "active" && (
                    <Button
                      variant="outline"
                      onClick={handleShowUpgradeOptions}
                      disabled={isProcessing}
                    >
                      Change Plan
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium">Plan</h3>
                    <p className="text-lg font-bold">{currentPlan?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {getFormattedPrice()}
                    </p>
                    {isAnnualPlan && (
                      <div className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
                        <p>You save by paying annually (2 months free)</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">Renewal Date</h3>
                    <p className="text-lg font-bold">{formatRenewalDate()}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activeSubscription.cancelAtPeriodEnd
                        ? "Your subscription will not renew after this date"
                        : isAnnualPlan
                        ? "Your plan renews once per year"
                        : "Your plan renews monthly"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium mb-2">Usage</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Events</span>
                        <span className="text-sm">
                          {currentUsage.toLocaleString()} /{" "}
                          {eventLimit.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={usagePercentage} />
                    </div>
                  </div>
                </div>

                {/* Billing Cycle Explanation */}
                {isAnnualPlan && (
                  <div className="pt-2 pb-0 px-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-md border border-emerald-100 dark:border-emerald-800">
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 py-2">
                      <strong>Annual Billing:</strong> You're on annual billing
                      which saves you money compared to monthly billing. Your
                      subscription will renew once per year on{" "}
                      {formatDate(activeSubscription.periodEnd)}.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {activeSubscription.status === "active" ? (
                activeSubscription.cancelAtPeriodEnd ? (
                  <Button
                    onClick={handleResumeSubscription}
                    disabled={isProcessing}
                    className="text-emerald-500 hover:text-emerald-600"
                  >
                    {isProcessing ? "Processing..." : "Resume Subscription"}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleCancelSubscription}
                    disabled={isProcessing}
                    className="text-red-500 hover:text-red-600"
                  >
                    {isProcessing ? "Processing..." : "Cancel Subscription"}
                  </Button>
                )
              ) : (
                <Button
                  onClick={handleResumeSubscription}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Resume Subscription"}
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Plan Features */}
          <PlanFeaturesCard currentPlan={currentPlan} />
        </div>
      )}

      {/* Help section */}
      <HelpSection router={router} />

      {/* Error dialog */}
      <ErrorDialog
        showConfigError={showConfigError}
        setShowConfigError={setShowConfigError}
        errorType={errorType}
        router={router}
      />

      {/* Change plan dialog */}
      <ChangePlanDialog
        showUpgradeDialog={showUpgradeDialog}
        setShowUpgradeDialog={setShowUpgradeDialog}
        actionError={actionError}
        upgradePlans={upgradePlans}
        activeSubscription={activeSubscription}
        isProcessing={isProcessing}
        handleUpgradeSubscription={handleUpgradeSubscription}
        router={router}
      />
    </div>
  );
}
