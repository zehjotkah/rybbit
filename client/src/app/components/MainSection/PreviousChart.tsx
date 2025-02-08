"use client";
import { ResponsiveLine } from "@nivo/line";
import { DateTime } from "luxon";
import { APIResponse, GetPageViewsResponse } from "../../../hooks/api";
import { nivoTheme } from "../../../lib/nivo";
import { useTimeSelection } from "../../../lib/timeSelectionStore";

export function PreviousChart({
  data,
  max,
}: {
  data: APIResponse<GetPageViewsResponse> | undefined;
  max?: number;
}) {
  const { time } = useTimeSelection();

  const formattedData = data?.data?.map((e) => ({
    x: DateTime.fromSQL(e.time).toUTC().toFormat("yyyy-MM-dd HH:mm:ss"),
    y: e.pageviews,
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
      }}
      yScale={{
        type: "linear",
        min: 0,
        stacked: false,
        reverse: false,
        max: max,
      }}
      enableGridX={false}
      enableGridY={false}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 0,
        tickPadding: 10,
        tickRotation: 0,
        truncateTickAt: 0,
        tickValues: 0,
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
        tickValues: 0,
      }}
      enableTouchCrosshair={true}
      enablePoints={false}
      useMesh={true}
      motionConfig="stiff"
      enableSlices={"x"}
      colors={["hsl(var(--neutral-700))"]}
      //   sliceTooltip={({ slice }) => {
      //     // if (isPrevious) return null;
      //     return (
      //       <div className="text-sm bg-neutral-900 p-2 rounded-md">
      //         <div>
      //           {DateTime.fromJSDate(
      //             slice.points[0].data.x as any
      //           ).toLocaleString(DateTime.DATETIME_SHORT)}
      //         </div>
      //         <div>
      //           {round(Number(slice.points[0].data.yFormatted)).toLocaleString()}
      //         </div>
      //       </div>
      //     );
      //   }}

      // layers={["grid", "markers", "areas", "", "lines", "points", "slices", "axes", "legends"]}
    />
  );
}
