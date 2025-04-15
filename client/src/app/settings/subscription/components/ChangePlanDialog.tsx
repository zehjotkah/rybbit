import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { Subscription } from "@/api/admin/subscription";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ChangePlanDialogProps {
  showUpgradeDialog: boolean;
  setShowUpgradeDialog: (show: boolean) => void;
  actionError: string | null;
  upgradePlans: any[];
  activeSubscription: Subscription | null | undefined;
  isProcessing: boolean;
  handleUpgradeSubscription: (planId: string) => Promise<void>;
  router: {
    push: (url: string) => void;
  };
}

export function ChangePlanDialog({
  showUpgradeDialog,
  setShowUpgradeDialog,
  actionError,
  upgradePlans,
  activeSubscription,
  isProcessing,
  handleUpgradeSubscription,
  router,
}: ChangePlanDialogProps) {
  // State to track if we're resuming a subscription
  const [resumingPlan, setResumingPlan] = useState<string | null>(null);
  // State to track billing interval preference
  const [isAnnual, setIsAnnual] = useState<boolean>(false);

  // When dialog opens and subscription is canceled, highlight the current plan
  useEffect(() => {
    if (
      showUpgradeDialog &&
      activeSubscription?.cancelAtPeriodEnd &&
      activeSubscription?.plan
    ) {
      setResumingPlan(activeSubscription.plan);
      // Initialize the annual toggle based on the current subscription
      setIsAnnual(activeSubscription.plan.includes("-annual"));
    } else if (showUpgradeDialog && activeSubscription?.plan) {
      // Initialize the annual toggle based on the current subscription
      setIsAnnual(activeSubscription.plan.includes("-annual"));
    } else {
      setResumingPlan(null);
    }
  }, [showUpgradeDialog, activeSubscription]);

  // Filter plans based on the selected billing interval
  const filteredPlans = upgradePlans.filter(
    (plan) =>
      plan.name.startsWith("basic") &&
      (isAnnual
        ? plan.name.includes("-annual")
        : !plan.name.includes("-annual"))
  );

  return (
    <Dialog
      open={showUpgradeDialog}
      onOpenChange={(open) => {
        setShowUpgradeDialog(open);
        if (!open) setResumingPlan(null);
      }}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {activeSubscription?.cancelAtPeriodEnd
              ? "Resume Subscription"
              : "Change Your Plan"}
          </DialogTitle>
          <DialogDescription className="py-4">
            {activeSubscription?.cancelAtPeriodEnd
              ? "Select a plan to resume your subscription. Your current plan is highlighted."
              : "Select a plan to switch to"}
          </DialogDescription>
        </DialogHeader>

        {actionError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{actionError}</AlertDescription>
          </Alert>
        )}

        {resumingPlan && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Resuming Subscription</AlertTitle>
            <AlertDescription>
              Your current plan is highlighted. Click "Select" to resume this
              plan or choose a different one.
            </AlertDescription>
          </Alert>
        )}

        {/* Billing toggle buttons */}
        <div className="flex justify-center mb-6">
          <div className="bg-neutral-100 dark:bg-neutral-800 p-1 rounded-full inline-flex relative">
            <button
              onClick={() => setIsAnnual(false)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all",
                !isAnnual
                  ? "bg-white dark:bg-neutral-700 shadow-sm text-black dark:text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
              )}
            >
              Monthly
            </button>
            <div className="relative">
              <button
                onClick={() => setIsAnnual(true)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all",
                  isAnnual
                    ? "bg-white dark:bg-neutral-700 shadow-sm text-black dark:text-white"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                )}
              >
                Annual
              </button>
              <Badge className="absolute -top-2 -right-2 bg-emerald-500 text-white border-0 pointer-events-none">
                2 months free
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {/* Pro Plans */}
          <div>
            <h3 className="font-medium mb-3 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-500" />
              Pro Plans
            </h3>
            <div className="space-y-3">
              {filteredPlans.map((plan) => (
                <Card
                  key={plan.priceId}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    (activeSubscription?.plan === plan.name &&
                      !activeSubscription?.cancelAtPeriodEnd) ||
                    resumingPlan === plan.name
                      ? "ring-2 ring-green-400"
                      : ""
                  }`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold">
                          {plan.limits.events.toLocaleString()} events
                          {isAnnual && (
                            <Badge className="ml-2 bg-emerald-500 text-white border-0 text-xs">
                              Save 17%
                            </Badge>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ${plan.price} / {plan.interval}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={
                          (activeSubscription?.plan === plan.name &&
                            !activeSubscription?.cancelAtPeriodEnd) ||
                          (resumingPlan === plan.name &&
                            resumingPlan === activeSubscription?.plan)
                            ? "outline"
                            : "default"
                        }
                        onClick={() => {
                          if (
                            activeSubscription?.plan !== plan.name ||
                            activeSubscription?.cancelAtPeriodEnd
                          ) {
                            handleUpgradeSubscription(plan.name);
                          }
                        }}
                        disabled={
                          (activeSubscription?.plan === plan.name &&
                            !activeSubscription?.cancelAtPeriodEnd) ||
                          isProcessing
                        }
                      >
                        {activeSubscription?.plan === plan.name &&
                        !activeSubscription?.cancelAtPeriodEnd
                          ? "Current"
                          : resumingPlan === plan.name &&
                            resumingPlan === activeSubscription?.plan
                          ? "Resume"
                          : isProcessing
                          ? "Processing..."
                          : "Select"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              router.push("/subscribe");
              setShowUpgradeDialog(false);
            }}
          >
            View All Plans
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
