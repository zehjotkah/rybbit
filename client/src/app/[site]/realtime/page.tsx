"use client";

import { getCountryName } from "../../../lib/utils";
import { CountryFlag } from "../components/shared/icons/CountryFlag";
import { StandardSectionRealtime } from "../components/shared/StandardSection/StandardSectionRealtime";
import { Countries } from "../main/components/sections/Countries";
import { Referrers } from "../main/components/sections/Referrers";
import { RealtimeMap } from "./RealtimeMap/RealtimeMap";

export default function RealtimePage() {
  return (
    <div className="flex flex-col gap-4">
      <RealtimeMap />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Countries isRealtime />
        <Referrers isRealtime />
      </div>
    </div>
  );
}
