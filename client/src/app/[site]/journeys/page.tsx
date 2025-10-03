"use client";

import { useJourneys } from "@/api/analytics/useJourneys";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useGetSite } from "../../../api/admin/sites";
import { DisabledOverlay } from "../../../components/DisabledOverlay";
import { useSetPageTitle } from "../../../hooks/useSetPageTitle";
import { timeZone } from "../../../lib/dateTimeUtils";
import { JOURNEY_PAGE_FILTERS, useStore } from "../../../lib/store";
import { SubHeader } from "../components/SubHeader/SubHeader";
import { SankeyDiagram } from "./components/SankeyDiagram";

export default function JourneysPage() {
  useSetPageTitle("Rybbit · Journeys");

  const [steps, setSteps] = useState<number>(3);
  const [maxJourneys, setMaxJourneys] = useState<number>(25);

  const { data: siteMetadata } = useGetSite();
  const { time } = useStore();

  const { data, isLoading, isFetching, error } = useJourneys({
    siteId: siteMetadata?.siteId,
    steps,
    timeZone: timeZone,
    time,
    limit: maxJourneys,
  });

  return (
    <DisabledOverlay message="User Journeys" featurePath="journeys">
      <div className="container mx-auto p-2 md:p-4">
        <SubHeader availableFilters={JOURNEY_PAGE_FILTERS} />
        <div className="flex justify-end items-center gap-2 mb-2">
          <Select value={steps.toString()} onValueChange={value => setSteps(Number(value))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Number of steps" />
            </SelectTrigger>
            <SelectContent>
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(step => (
                <SelectItem key={step} value={step.toString()}>
                  {step} steps
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={maxJourneys.toString()} onValueChange={value => setMaxJourneys(Number(value))}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Max journeys" />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100, 150, 200].map(count => (
                <SelectItem key={count} value={count.toString()}>
                  {count} journeys
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Failed to load journey data. Please try again.</AlertDescription>
          </Alert>
        )}

        {data?.journeys?.length === 0 && !isLoading && !error && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Data</AlertTitle>
            <AlertDescription>No journey data found for the selected criteria.</AlertDescription>
          </Alert>
        )}

        {data?.journeys?.length && data?.journeys?.length > 0 && siteMetadata?.domain ? (
          <div className="relative">
            {(isLoading || isFetching) && (
              <div className="absolute inset-0 bg-neutral-900/30 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 rounded-full border-2 border-accent-400 border-t-transparent animate-spin"></div>
                  <span className="text-sm text-neutral-300">Loading journey data...</span>
                </div>
              </div>
            )}
            <SankeyDiagram
              journeys={data.journeys}
              steps={steps}
              maxJourneys={maxJourneys}
              domain={siteMetadata.domain}
            />
          </div>
        ) : null}
      </div>
    </DisabledOverlay>
  );
}
