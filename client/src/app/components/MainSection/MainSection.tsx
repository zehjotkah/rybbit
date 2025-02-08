"use client";
import { Card, CardContent, CardLoader } from "@/components/ui/card";
import { useGetOverview, useGetPageviews } from "../../../hooks/api";
import { BucketSelection } from "./BucketSelection";
import { Chart } from "./Chart";
import { PreviousChart } from "./PreviousChart";

export function MainSection() {
  const { data, isFetching, error } = useGetPageviews();
  const {
    data: previousData,
    isFetching: isPreviousFetching,
    error: previousError,
  } = useGetPageviews(true);
  const {
    data: overviewData,
    isFetching: isOverviewFetching,
    error: overviewError,
  } = useGetOverview();

  const maxOfDataAndPreviousData = Math.max(
    Math.max(...(data?.data?.map((d) => d.pageviews) ?? [])),
    Math.max(...(previousData?.data?.map((d) => d.pageviews) ?? []))
  );

  return (
    <Card>
      {(isFetching || isOverviewFetching) && <CardLoader />}
      <CardContent className="pt-4 w-full">
        <div className="flex justify-between items-center">
          <div className="flex gap-8 items-center">
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-muted-foreground">
                Unique Users
              </div>
              <div className="text-3xl font-medium">
                {overviewData?.data?.users.toLocaleString()}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-muted-foreground">
                Sessions
              </div>
              <div className="text-3xl font-medium">
                {overviewData?.data?.sessions.toLocaleString()}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-muted-foreground">
                Pageviews
              </div>
              <div className="text-3xl font-medium">
                {overviewData?.data?.pageviews.toLocaleString()}
              </div>
            </div>
          </div>
          <BucketSelection />
        </div>
        <div className="h-[350px] relative">
          <div className="absolute top-0 left-0 w-full h-full">
            <PreviousChart data={previousData} max={maxOfDataAndPreviousData} />
          </div>
          <div className="absolute top-0 left-0 w-full h-full">
            <Chart
              data={data}
              max={maxOfDataAndPreviousData}
              previousData={previousData}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
