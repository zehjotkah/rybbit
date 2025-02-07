"use client";
import { Card, CardContent, CardLoader } from "@/components/ui/card";
import { useTimeSelection } from "../../../lib/timeSelectionStore";
import { BucketSelection } from "./BucketSelection";
import { Chart } from "./Chart";
import { useGetPageviews } from "../../../hooks/api";

export function MainSection() {
  const { data, isLoading, error } = useGetPageviews();
  console.log(data);

  return (
    <Card>
      {isLoading && <CardLoader />}
      <CardContent className="pt-4 w-full">
        <BucketSelection />
        <div className="h-[350px]">
          <Chart data={data} />
        </div>
      </CardContent>
    </Card>
  );
}
