"use client";
import { ResponsiveLine } from "@nivo/line";
import { round } from "lodash";
import { DateTime } from "luxon";
import { APIResponse, GetPageViewsResponse } from "@/hooks/api";
import { nivoTheme } from "@/lib/nivo";
import { Time, TimeBucket, useStore } from "@/lib/store";

export const formatter = Intl.NumberFormat("en", { notation: "compact" });

const getMax = (time: Time, bucket: TimeBucket) => {
  const now = DateTime.now();
  if (time.mode === "day") {
    const dayDate = DateTime.fromISO(time.day)
      .endOf("day")
      .minus({ minutes: 59 });
    return now < dayDate ? dayDate.toJSDate() : undefined;
  } else if (time.mode === "range") {
    if (bucket === "hour") {
      const endDate = DateTime.fromISO(time.endDate).endOf("day").minus({
        minutes: 59,
      });
      return now < endDate ? endDate.toJSDate() : undefined;
    }
    return undefined;
  } else if (time.mode === "week") {
    const weekDate = DateTime.fromISO(time.week).endOf("week");
    return now < weekDate ? weekDate.toJSDate() : undefined;
  } else if (time.mode === "month") {
    const monthDate = DateTime.fromISO(time.month).endOf("month");
    return now < monthDate ? monthDate.toJSDate() : undefined;
  } else if (time.mode === "year") {
    const yearDate = DateTime.fromISO(time.year).endOf("year");
    return now < yearDate ? yearDate.toJSDate() : undefined;
  }
  return undefined;
};

const getMin = (time: Time, bucket: TimeBucket) => {
  if (time.mode === "day") {
    const dayDate = DateTime.fromISO(time.day).startOf("day");
    return dayDate.toJSDate();
  } else if (time.mode === "week") {
    const weekDate = DateTime.fromISO(time.week).startOf("week");
    return weekDate.toJSDate();
  } else if (time.mode === "month") {
    const monthDate = DateTime.fromISO(time.month).startOf("month");
    return monthDate.toJSDate();
  } else if (time.mode === "year") {
    const yearDate = DateTime.fromISO(time.year).startOf("year");
    return yearDate.toJSDate();
  } else if (time.mode === "range") {
    const startDate = DateTime.fromISO(time.startDate).startOf("day");
    const endDate = DateTime.fromISO(time.endDate).startOf("day");
    return startDate.toJSDate();
  }
  return undefined;
};

export function Chart({
  data,
  previousData,
  max,
}: {
  data: APIResponse<GetPageViewsResponse> | undefined;
  previousData: APIResponse<GetPageViewsResponse> | undefined;
  max: number;
}) {
  const { time, bucket } = useStore();

  // When the current period has more datapoints than the previous period,
  // we need to shift the previous datapoints to the right by the difference in length
  const lengthDiff = Math.max(
    (data?.data?.length ?? 0) - (previousData?.data?.length ?? 0),
    0
  );

  const formattedData = data?.data?.map((e, i) => ({
    x: DateTime.fromSQL(e.time).toUTC().toFormat("yyyy-MM-dd HH:mm:ss"),
    y: e.pageviews,
    previousY:
      i >= lengthDiff && previousData?.data?.[i - lengthDiff]?.pageviews,
    currentTime: DateTime.fromSQL(e.time),
    previousTime:
      i >= lengthDiff
        ? DateTime.fromSQL(previousData?.data?.[i - lengthDiff]?.time ?? "")
        : undefined,
  }));

  return (
    <ResponsiveLine
      data={[
        {
          id: "1",
          data: formattedData ?? [],
        },
      ]}
      theme={nivoTheme}
      margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
      xScale={{
        type: "time",
        format: "%Y-%m-%d %H:%M:%S",
        precision: "second",
        useUTC: true,
        max: getMax(time, bucket),
        min: getMin(time, bucket),
      }}
      yScale={{
        type: "linear",
        min: 0,
        stacked: false,
        reverse: false,
        max: max,
      }}
      enableGridX={false}
      enableGridY={true}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 0,
        tickPadding: 10,
        tickRotation: 0,
        truncateTickAt: 0,
        tickValues:
          time.mode === "day" ? 24 : Math.min(12, data?.data?.length ?? 0),
        format: (value) => {
          if (time.mode === "day") {
            return DateTime.fromJSDate(value).toFormat("ha");
          } else if (time.mode === "range") {
            return DateTime.fromJSDate(value).toFormat("MMM d");
          } else if (time.mode === "week") {
            return DateTime.fromJSDate(value).toFormat("MMM d");
          } else if (time.mode === "month") {
            return DateTime.fromJSDate(value).toFormat("MMM d");
          }
        },
      }}
      axisLeft={{
        tickSize: 0,
        tickPadding: 10,
        tickRotation: 0,
        truncateTickAt: 0,
        tickValues: 4,
        format: formatter.format,
      }}
      enableTouchCrosshair={true}
      enablePoints={false}
      useMesh={true}
      motionConfig="stiff"
      enableSlices={"x"}
      colors={["hsl(var(--fuchsia-400))"]}
      enableArea={true}
      areaBaselineValue={0}
      areaOpacity={0.3}
      defs={[
        {
          id: "gradient",
          type: "linearGradient",
          colors: [
            { offset: 0, color: "hsl(var(--fuchsia-400))", opacity: 1 },
            { offset: 100, color: "hsl(var(--fuchsia-400))", opacity: 0 },
          ],
        },
      ]}
      fill={[{ match: (d) => d.id === "1", id: "gradient" }]}
      sliceTooltip={({ slice }: any) => {
        const currentY = Number(slice.points[0].data.yFormatted);
        const previousY = Number(slice.points[0].data.previousY) || 0;
        const currentTime = slice.points[0].data.currentTime as DateTime;
        const previousTime = slice.points[0].data.previousTime as DateTime;

        const diff = currentY - previousY;
        const diffPercentage = (diff / previousY) * 100;

        return (
          <div className="text-sm bg-neutral-900 p-2 rounded-md">
            {previousY ? (
              <div
                className="text-lg font-medium"
                style={{
                  color:
                    diffPercentage > 0
                      ? "hsl(var(--green-400))"
                      : "hsl(var(--red-400))",
                }}
              >
                {diffPercentage > 0 ? "+" : ""}
                {diffPercentage.toFixed(2)}%
              </div>
            ) : null}
            <div className="flex justify-between text-sm w-36">
              <div>
                {bucket === "hour"
                  ? currentTime.toFormat("M/d h a")
                  : currentTime.toLocaleString()}
              </div>
              <div>{round(currentY).toLocaleString()}</div>
            </div>
            {previousTime && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <div>
                  {bucket === "hour"
                    ? previousTime.toFormat("M/d h a")
                    : previousTime.toLocaleString()}
                </div>
                <div>{round(previousY).toLocaleString()}</div>
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
