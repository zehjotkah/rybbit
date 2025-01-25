"use client";

import { useQuery } from "@tanstack/react-query";
import { getPageViews } from "../actions/actions";
import { ResponsiveBar } from "@nivo/bar";

export function PageViews() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["pageviews"],
    queryFn: () => getPageViews(1),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  // Transform data for the bar chart
  const chartData =
    data?.data?.map((item: any) => ({
      hour: new Date(item.hour).toLocaleTimeString([], {
        hour: "2-digit",
        hour12: true,
      }),
      pageviews: item.pageviews,
    })) || [];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Page Views (Last 24 Hours)</h2>
      <div className="h-[400px] w-full border rounded-lg p-4 bg-card">
        <ResponsiveBar
          data={chartData}
          keys={["pageviews"]}
          indexBy="hour"
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          colors={{ scheme: "category10" }}
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: "var(--foreground)",
                },
              },
              legend: {
                text: {
                  fill: "var(--foreground)",
                },
              },
            },
            legends: {
              text: {
                fill: "var(--foreground)",
              },
            },
            tooltip: {
              container: {
                background: "var(--background)",
                color: "var(--foreground)",
                fontSize: 12,
              },
            },
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Pageviews",
            legendPosition: "middle",
            legendOffset: -40,
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: "Hour",
            legendPosition: "middle",
            legendOffset: 40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          role="application"
          ariaLabel="Pageviews bar chart"
        />
      </div>
    </div>
  );
}
