"use client";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPageViews } from "../../actions/getPageviews";
import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { formatter } from "../../../lib/utils";

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

// Helper function to generate nice round numbers
function generateNiceTicks(max: number, count: number = 5) {
  let roundedTo;

  const ticks = [];
  // Round max up to a nice number
  const niceMax = Math.ceil(max / 1000) * 1000;
  const step = Math.ceil(niceMax / (count - 1));

  for (let i = 0; i <= count - 1; i++) {
    ticks.push(step * i);
  }

  return ticks;
}

export function MainSection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["pageviews"],
    queryFn: () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return getPageViews({ days: 1, timezone });
    },
  });
  const [timeRange, setTimeRange] = React.useState("90d");

  if (isLoading || !data?.data) return <div>Loading...</div>;

  const filteredData = data.data.map((e) => ({
    date: e.time,
    desktop: e.pageviews,
    // mobile: e.pageviews,
  }));

  const maxPageviews = Math.max(...filteredData.map((e) => e.desktop));

  return (
    <Card>
      {/* <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader> */}
      <CardContent className="pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
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
                    const date2 = DateTime.fromFormat(
                      value,
                      "yyyy-MM-dd HH:mm:ss"
                    );
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
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
