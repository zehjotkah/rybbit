import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { useGetOverviewBucketed } from "../../../../../api/analytics/useGetOverviewBucketed";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../../../../components/ui/basic-tabs";
import {
  Card,
  CardContent,
  CardLoader,
} from "../../../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../../components/ui/tooltip";
import { StatType, useStore } from "../../../../../lib/store";

export function Weekdays() {
  const { site } = useStore();
  const [metric, setMetric] = useState<StatType>("users");

  const { data, isFetching, error } = useGetOverviewBucketed({
    site,
    bucket: "hour",
  });

  // Generate aggregated data for the heatmap
  const heatmapData = useMemo(() => {
    if (!data?.data) return [];

    // Initialize a 2D array for days (0-6) and hours (0-23)
    const aggregated: number[][] = Array(7)
      .fill(0)
      .map(() => Array(24).fill(0));

    // Initialize a counter for each day-hour combination
    const counts: number[][] = Array(7)
      .fill(0)
      .map(() => Array(24).fill(0));

    // Process each data point
    data.data.forEach((item) => {
      if (!item || !item.time) return;

      // Parse the timestamp
      const date = DateTime.fromSQL(item.time);
      console.log(date);
      if (!date.isValid) return;

      const dayOfWeek = date.weekday % 7; // 0 = Monday, 6 = Sunday in Luxon
      const hourOfDay = date.hour;

      // Safely check if the metric exists and is a number
      const metricValue = typeof item[metric] === "number" ? item[metric] : 0;

      // Add the value for the selected metric
      aggregated[dayOfWeek][hourOfDay] += metricValue;
      counts[dayOfWeek][hourOfDay]++;
    });

    // Calculate averages for each day-hour combination
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        if (counts[day][hour] > 0) {
          aggregated[day][hour] = aggregated[day][hour] / counts[day][hour];
        }
      }
    }

    return aggregated;
  }, [data, metric]);

  console.log(heatmapData);

  // Find max value for color intensity scaling
  const maxValue = useMemo(() => {
    if (!heatmapData || !heatmapData.length) return 0;

    let max = 0;
    for (const row of heatmapData) {
      for (const value of row) {
        if (typeof value === "number" && !isNaN(value) && value > max) {
          max = value;
        }
      }
    }
    return max;
  }, [heatmapData]);

  // Days of the week for column headers
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  // Generate time labels for the row headers
  const timeLabels = useMemo(() => {
    return Array(24)
      .fill(0)
      .map((_, hour) => {
        const isPM = hour >= 12;
        const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${h} ${isPM ? "PM" : "AM"}`;
      });
  }, []);

  // Get color intensity based on value
  const getColorIntensity = (value: number) => {
    if (maxValue === 0 || !isFinite(value) || isNaN(value))
      return "bg-neutral-800";

    // Calculate intensity level 1-10
    const ratio = value / maxValue;

    // Use predefined opacity classes that are guaranteed to exist in Tailwind
    if (ratio < 0.1) return "bg-green-500 bg-opacity-10";
    if (ratio < 0.2) return "bg-green-500 bg-opacity-20";
    if (ratio < 0.3) return "bg-green-500 bg-opacity-30";
    if (ratio < 0.4) return "bg-green-500 bg-opacity-40";
    if (ratio < 0.5) return "bg-green-500 bg-opacity-50";
    if (ratio < 0.6) return "bg-green-500 bg-opacity-60";
    if (ratio < 0.7) return "bg-green-500 bg-opacity-70";
    if (ratio < 0.8) return "bg-green-500 bg-opacity-80";
    if (ratio < 0.9) return "bg-green-500 bg-opacity-90";
    return "bg-green-500";
  };

  return (
    <Card>
      {isFetching && <CardLoader />}
      <CardContent className="mt-2">
        <div className="flex flex-row items-center justify-between">
          <Tabs defaultValue="pages" value={"pages"}>
            <TabsList>
              <TabsTrigger value="pages">Weekly Trends</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select
            value={metric}
            onValueChange={(value) => setMetric(value as StatType)}
          >
            <SelectTrigger className="w-[160px]" size="sm">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="users">Unique Visitors</SelectItem>
              <SelectItem value="pageviews">Pageviews</SelectItem>
              <SelectItem value="sessions">Sessions</SelectItem>
              <SelectItem value="bounce_rate">Bounce Rate</SelectItem>
              <SelectItem value="pages_per_session">
                Pages per Session
              </SelectItem>
              <SelectItem value="session_duration">Session Duration</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TooltipProvider delayDuration={0}>
          <div className="flex mt-2 p-2">
            <div className="w-12">
              {/* Empty top-left cell */}
              <div className="h-6"></div>

              {/* Time labels */}
              {timeLabels.map((label, i) => (
                <div
                  key={i}
                  className="h-6 text-xs flex items-center justify-end pr-2 text-neutral-400"
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="flex-1">
              {/* Day labels */}
              <div className="flex h-6">
                {days.map((day, i) => (
                  <div
                    key={i}
                    className="flex-1 text-center text-sm text-neutral-400"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Heatmap grid */}
              {Array(24)
                .fill(0)
                .map((_, hour) => (
                  <div key={hour} className="flex h-6">
                    {Array(7)
                      .fill(0)
                      .map((_, day) => {
                        const value =
                          heatmapData &&
                          heatmapData.length > day &&
                          Array.isArray(heatmapData[day]) &&
                          heatmapData[day].length > hour
                            ? heatmapData[day][hour]
                            : 0;
                        const colorClass =
                          value > 0
                            ? getColorIntensity(value)
                            : "bg-neutral-800";
                        return (
                          <Tooltip key={day}>
                            <TooltipTrigger asChild>
                              <div
                                className={`flex-1 mx-0.5 ${colorClass} hover:ring-1 hover:ring-green-300 transition-all rounded-sm my-0.5`}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              {`${days[day]} ${timeLabels[hour]}: ${Math.round(
                                value || 0
                              )} ${metric}`}
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                  </div>
                ))}
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
