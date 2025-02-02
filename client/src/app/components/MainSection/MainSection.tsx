"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { formatter } from "../../../lib/utils";
import { getPageViews } from "../../actions/getPageviews";
import { Spinner } from "@/components/ui/spinner";
import { useStore } from "../../../lib/store";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-5))",
    // color: "hsl(var(--chart-1))",
  },
  //   mobile: {
  //     label: "Mobile",
  //     color: "hsl(var(--chart-2))",
  //   },
} satisfies ChartConfig;

export function MainSection() {
  const { date } = useStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ["pageviews"],
    queryFn: () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return getPageViews({
        startDate: date[0],
        endDate: date[1],
        timezone,
      });
    },
  });

  let body = <Spinner />;

  if (data?.data) {
    const filteredData = data.data.map((e) => ({
      date: e.time,
      desktop: e.pageviews,
      // mobile: e.pageviews,
    }));

    const maxPageviews = Math.max(...filteredData.map((e) => e.desktop));

    body = (
      <AreaChart data={filteredData}>
        <defs>
          <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-desktop)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-desktop)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-mobile)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-mobile)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={-100}
          // tickCount={10}
          tickFormatter={(value) => {
            const date2 = DateTime.fromFormat(value, "yyyy-MM-dd HH:mm:ss");
            return date2.toFormat("ha");
          }}
        />
        <YAxis
          dataKey="desktop"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={10}
          tickCount={5}
          domain={[0, maxPageviews]}
          tickFormatter={(value) => {
            return formatter(value);
          }}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => {
                const date2 = DateTime.fromFormat(value, "yyyy-MM-dd HH:mm:ss");
                return date2.toFormat("ha");
              }}
              indicator="dot"
            />
          }
        />
        <Area
          dataKey="mobile"
          type="linear"
          fill="url(#fillMobile)"
          stroke="var(--color-mobile)"
          stackId="a"
        />
        <Area
          dataKey="desktop"
          type="linear"
          fill="url(#fillDesktop)"
          stroke="var(--color-desktop)"
          stackId="a"
        />
        {/* <ChartLegend content={<ChartLegendContent />} /> */}
      </AreaChart>
    );
  }

  return (
    <Card>
      <CardContent className="pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          {body}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
