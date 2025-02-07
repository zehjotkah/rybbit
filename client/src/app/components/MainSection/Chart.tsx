"use client";
import { Theme } from "@nivo/core";
import { ResponsiveLine } from "@nivo/line";
import { DateTime } from "luxon";
import { round } from "lodash";
import { Time, useTimeSelection } from "../../../lib/timeSelectionStore";
import { GetPageViewsResponse } from "../../../hooks/api";

export const nivoTheme: Theme = {
  axis: {
    legend: {
      text: {
        fill: "hsl(var(--neutral-400))",
      },
    },
    ticks: {
      line: {},
      text: {
        fill: "hsl(var(--neutral-400))",
      },
    },
  },
  grid: {
    line: {
      stroke: "hsl(var(--neutral-800))",
      strokeWidth: 1,
    },
  },
  tooltip: {
    basic: {
      fontFamily: "Roboto Mono",
    },
    container: {
      backdropFilter: "blur( 7px )",
      background: "rgb(40, 40, 40, 0.8)",
      color: "rgb(255, 255, 255)",
    },
  },
  crosshair: { line: { stroke: "hsl(var(--neutral-50))" } },
  annotations: {
    text: {
      fill: "hsl(var(--neutral-400))",
    },
  },
  text: {
    fill: "hsl(var(--neutral-400))",
  },
  labels: {
    text: {
      fill: "hsl(var(--neutral-400))",
    },
  },
};

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
}: {
  data:
    | {
        data?: GetPageViewsResponse;
        error?: string;
      }
    | undefined;
}) {
  const { time } = useTimeSelection();

  const formattedData = data?.data?.map((e) => ({
    x: DateTime.fromSQL(e.time).toUTC().toFormat("yyyy-MM-dd HH:mm:ss"),
    y: e.pageviews,
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
      margin={{ top: 20, right: 20, bottom: 20, left: 30 }}
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
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      enableGridX={false}
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
      fill={[{ match: "*", id: "gradient" }]}
      sliceTooltip={({ slice }) => {
        return (
          <div className="text-sm bg-neutral-900 p-2 rounded-md">
            <div>
              {DateTime.fromJSDate(
                slice.points[0].data.x as any
              ).toLocaleString(DateTime.DATETIME_SHORT)}
            </div>
            <div>
              {round(Number(slice.points[0].data.yFormatted)).toLocaleString()}
            </div>
          </div>
        );
      }}
    />
  );
}
