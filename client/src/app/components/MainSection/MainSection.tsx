"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useTimeSelection } from "../../../lib/timeSelectionStore";
import { useGetPageviews } from "../../hooks/useGetPageviews";
import { BucketSelection } from "./BucketSelection";
import { Chart } from "./Chart";

export function MainSection() {
  const { data, isLoading, error } = useGetPageviews();

  return (
    <Card>
      <CardContent className="pt-4 w-full">
        <BucketSelection />
        <div className="h-[350px]">
          <Chart data={data} />
        </div>
      </CardContent>
    </Card>
  );
}
