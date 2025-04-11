"use client";

import { useMeasure, useWindowSize } from "@uidotdev/usehooks";
import { Countries } from "../main/components/sections/Countries";
import { Events } from "../main/components/sections/Events";
import { Pages } from "../main/components/sections/Pages";
import { Referrers } from "../main/components/sections/Referrers";
import { RealtimeChart } from "./RealtimeChart/RealtimeChart";
import { World } from "./RealtimeGlobe/RealtimeGlobe";
import { useGetLiveUsercount } from "../../../api/analytics/useLiveUserCount";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "../../../components/ui/select";
import { useAtom } from "jotai";
import { minutesAtom, MinutesType } from "./realtimeStore";
import NumberFlow from "@number-flow/react";

export default function RealtimePage() {
  const [ref, { width }] = useMeasure();
  const size = useWindowSize();

  const [minutes, setMinutes] = useAtom(minutesAtom);

  const { data } = useGetLiveUsercount(Number(minutes));

  return (
    <div style={{ position: "relative", overflow: "hidden" }} ref={ref}>
      <World width={width ?? 0} />

      <div className="absolute top-4 left-4 flex justify-center items-center w-full">
        <div style={{ width: size.height ?? 0 }}>
          <div className="flex flex-col  p-4 pt-3 bg-neutral-900 rounded-lg shadow-lg border border-neutral-750 w-fit">
            <div className="text-sm text-gray-400 flex gap-2 text-nowrap items-center">
              Visitors in the last{" "}
              <Select
                value={minutes}
                onValueChange={(value) => setMinutes(value as MinutesType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                  <SelectItem value="480">8 hours</SelectItem>
                  <SelectItem value="720">12 hours</SelectItem>
                  <SelectItem value="1440">24 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-4xl font-bold">
              {
                <NumberFlow
                  respectMotionPreference={false}
                  value={data?.count ?? 0}
                />
              }
            </div>
          </div>
        </div>
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Pages isRealtime />
        <Events isRealtime />
        <Referrers isRealtime />
        <Countries isRealtime />
      </div> */}
    </div>
  );
}
