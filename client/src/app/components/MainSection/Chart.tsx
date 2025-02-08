"use client";
import { ResponsiveLine } from "@nivo/line";
import { round } from "lodash";
import { DateTime } from "luxon";
import { APIResponse, GetPageViewsResponse } from "../../../hooks/api";
import { nivoTheme } from "../../../lib/nivo";
import { Time, useTimeSelection } from "../../../lib/timeSelectionStore";

export const formatter = Intl.NumberFormat("en", { notation: "compact" });

const getMax = (time: Time) => {
  const now = DateTime.now();

  if (time.mode === "day") {
    const dayDate = DateTime.fromISO(time.day)
      .endOf("day")
      .minus({ minutes: 59 });
    return now < dayDate ? dayDate.toJSDate() : undefined;
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

export function Chart({
  data,
  previousData,
  max,
}: {
  data: APIResponse<GetPageViewsResponse> | undefined;
  previousData: APIResponse<GetPageViewsResponse> | undefined;
  max?: number;
}) {
  const { time } = useTimeSelection();

  const formattedData = data?.data?.map((e, i) => ({
    x: DateTime.fromSQL(e.time).toUTC().toFormat("yyyy-MM-dd HH:mm:ss"),
    y: e.pageviews,
    previousY: previousData?.data?.[i]?.pageviews,

    currentTime: DateTime.fromSQL(e.time).toUTC(),
    previousTime: DateTime.fromSQL(previousData?.data?.[i]?.time ?? "").toUTC(),
  }));

  const timeRange =
    time.mode === "range"
      ? DateTime.fromISO(time.startDate).diff(
          DateTime.fromISO(time.endDate),
          "days"
        ).days
      : 0;

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
        max: getMax(time),
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
        const previousY = Number(slice.points[0].data.previousY);
        const currentTime = slice.points[0].data.currentTime as DateTime;
        const previousTime = slice.points[0].data.previousTime as DateTime;

        const diff = currentY - previousY;
        const diffPercentage = (diff / previousY) * 100;

        return (
          <div className="text-sm bg-neutral-900 p-2 rounded-md">
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
            <div className="flex justify-between text-sm w-36">
              <div>
                {time.mode === "day"
                  ? currentTime.toFormat("M/d h a")
                  : currentTime.toLocaleString()}
              </div>
              <div>{round(currentY).toLocaleString()}</div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <div>
                {time.mode === "day"
                  ? previousTime.toFormat("M/d h a")
                  : previousTime.toLocaleString()}
              </div>
              <div>{round(previousY).toLocaleString()}</div>
            </div>
          </div>
        );
      }}
    />
  );
}
