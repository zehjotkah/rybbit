"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useTimeSelection } from "../../../lib/timeSelectionStore";
import { useGetPageviews } from "../../hooks/useGetPageviews";
import { Chart } from "./Chart";

export function MainSection() {
  const { time } = useTimeSelection();

  const { data, isLoading, error } = useGetPageviews();

  return (
    <Card>
      <CardContent className="pt-4 sm:px-6 sm:pt-6 aspect-auto h-[350px] w-full">
        <Chart data={data} />
      </CardContent>
    </Card>
  );
}
