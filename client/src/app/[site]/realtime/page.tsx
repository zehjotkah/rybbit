"use client";

import { useMeasure } from "@uidotdev/usehooks";
import { Countries } from "../main/components/sections/Countries";
import { Events } from "../main/components/sections/Events";
import { Pages } from "../main/components/sections/Pages";
import { Referrers } from "../main/components/sections/Referrers";
import { RealtimeChart } from "./RealtimeChart/RealtimeChart";
import { World } from "./RealtimeGlobe/RealtimeGlobe";

export default function RealtimePage() {
  const [ref, { width }] = useMeasure();

  return (
    <div className="flex flex-col gap-4" ref={ref}>
      <World width={width ?? 0} />
      <RealtimeChart />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Pages isRealtime />
        <Events isRealtime />
        <Referrers isRealtime />
        <Countries isRealtime />
      </div>
    </div>
  );
}
