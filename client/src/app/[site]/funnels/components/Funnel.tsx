"use client";

import { FunnelResponse } from "@/api/analytics/useGetFunnel";
import { DateSelector } from "@/components/DateSelector/DateSelector";
import { Time } from "@/components/DateSelector/types";
import { ArrowDown, ArrowRight, ChevronRight } from "lucide-react";

export type FunnelChartData = {
  stepName: string;
  visitors: number;
  conversionRate: number;
  dropoffRate: number;
  stepNumber: number;
};

interface FunnelProps {
  data?: FunnelResponse[] | undefined;
  isError: boolean;
  error: unknown;
  isPending: boolean;
  time: Time;
  setTime: (time: Time) => void;
}

export function Funnel({
  data,
  isError,
  error,
  isPending,
  time,
  setTime,
}: FunnelProps) {
  // Prepare chart data
  const chartData =
    data?.map((step) => ({
      stepName: step.step_name,
      visitors: step.visitors,
      conversionRate: step.conversion_rate,
      dropoffRate: step.dropoff_rate,
      stepNumber: step.step_number,
    })) || [];

  // Get first and last data points for total conversion metrics
  const firstStep = chartData[0];
  const lastStep = chartData[chartData.length - 1];
  const totalConversionRate = lastStep?.conversionRate || 0;

  const maxBarWidth = 100; // as percentage

  return (
    <div>
      <div className="flex justify-end items-center gap-2 mb-6">
        <DateSelector time={time} setTime={setTime} />
      </div>

      {isError ? (
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-red-500">
            Error:{" "}
            {error instanceof Error
              ? error.message
              : "Failed to analyze funnel"}
          </div>
        </div>
      ) : data && chartData.length > 0 ? (
        <div className="space-y-1">
          {/* Overall conversion rate summary */}
          <div className="border border-neutral-800 rounded-md p-4 mb-4 bg-neutral-900/50">
            <div className="text-sm text-neutral-400">Total Conversion</div>
            <div className="text-2xl font-semibold">
              {totalConversionRate.toFixed(2)}%
            </div>
            <div className="text-sm text-neutral-400">
              {lastStep?.visitors.toLocaleString()} out of{" "}
              {firstStep?.visitors.toLocaleString()} users
            </div>
          </div>

          {/* Funnel steps list */}
          <div className="space-y-6">
            {chartData.map((step, index) => {
              // Calculate the percentage width for the bar
              const ratio = firstStep?.visitors
                ? step.visitors / firstStep.visitors
                : 0;
              const barWidth = Math.max(ratio * maxBarWidth, 0);

              // For step 2+, calculate the number of users who dropped off
              const prevStep = index > 0 ? chartData[index - 1] : null;
              const droppedUsers = prevStep
                ? prevStep.visitors - step.visitors
                : 0;
              const dropoffPercent = prevStep
                ? (droppedUsers / prevStep.visitors) * 100
                : 0;

              return (
                <div key={step.stepNumber} className="relative pb-6">
                  {/* Step number indicator */}
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-xs mr-2">
                      {step.stepNumber}
                    </div>
                    <div className="font-medium text-base">{step.stepName}</div>
                  </div>

                  {/* Bar and metrics */}
                  <div className="flex items-center pl-8">
                    {/* Metrics */}
                    <div className="flex-shrink-0 min-w-[180px] mr-4">
                      <div className="flex items-baseline">
                        <span className="text-lg font-semibold">
                          {step.visitors.toLocaleString()}
                        </span>
                        <span className="text-sm text-neutral-400 ml-2">
                          users
                        </span>
                      </div>
                      <div className="text-sm">
                        {index === 0 ? (
                          <span className="text-neutral-400">Entry point</span>
                        ) : (
                          <span className="text-green-500">
                            {step.conversionRate.toFixed(2)}% conversion
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bar */}
                    <div className="flex-grow h-10 bg-neutral-800 rounded-md overflow-hidden">
                      <div
                        className="h-full bg-accent-400/70 rounded-md"
                        style={{ width: `${barWidth}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Dropoff indicator */}
                  {index < chartData.length - 1 && (
                    <div className="absolute left-[11px] -bottom-6 top-6 flex flex-col items-center">
                      <div className="h-full w-0.5 bg-neutral-800"></div>
                    </div>
                  )}

                  {/* Dropoff metrics */}
                  {index < chartData.length - 1 && (
                    <div className="pl-8 mt-2 flex">
                      <div className="min-w-[180px] mr-4">
                        <div className="flex items-baseline text-orange-500">
                          <span className="text-sm font-medium">
                            {droppedUsers.toLocaleString()} dropped off
                          </span>
                          <span className="text-sm text-neutral-400 ml-1">
                            ({dropoffPercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-neutral-400 text-sm">
            {isPending
              ? "Analyzing funnel..."
              : "Configure your funnel steps and click 'Analyze Funnel'"}
          </div>
        </div>
      )}
    </div>
  );
}
