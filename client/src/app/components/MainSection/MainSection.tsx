"use client";
import { Card, CardContent, CardLoader } from "@/components/ui/card";
import { useGetPageviews } from "../../../hooks/api";
import { BucketSelection } from "./BucketSelection";
import { Chart } from "./Chart";

export function MainSection() {
  const { data, isFetching, error } = useGetPageviews();

  return (
    <Card>
      {isFetching && <CardLoader />}
      <CardContent className="pt-4 w-full">
        <BucketSelection />
        <div className="h-[350px]">
          <Chart data={data} />
        </div>
      </CardContent>
    </Card>
  );
}
