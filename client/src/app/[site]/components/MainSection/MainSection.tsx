"use client";
import { Card, CardContent, CardLoader } from "@/components/ui/card";
import { useGetOverview, useGetOverviewBucketed } from "@/hooks/api";
import { BucketSelection } from "./BucketSelection";
import { Chart } from "./Chart";
import { Overview } from "./Overview";
import { PreviousChart } from "./PreviousChart";

export function MainSection() {
  const { data, isFetching, error } = useGetOverviewBucketed();
  const {
    data: previousData,
    isFetching: isPreviousFetching,
    error: previousError,
  } = useGetOverviewBucketed("previous");
  const { isFetching: isOverviewFetching } = useGetOverview();
  const { isFetching: isOverviewFetchingPrevious } = useGetOverview("previous");

  const maxOfDataAndPreviousData = Math.max(
    Math.max(...(data?.data?.map((d) => d.pageviews) ?? [])),
    Math.max(...(previousData?.data?.map((d) => d.pageviews) ?? []))
  );

  return (
    <Card>
      {(isFetching ||
        isPreviousFetching ||
        isOverviewFetching ||
        isOverviewFetchingPrevious) && <CardLoader />}
      <CardContent className="pt-4 w-full">
        <div className="flex justify-between items-center">
          <Overview />
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
