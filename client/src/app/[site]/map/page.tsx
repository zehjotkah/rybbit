"use client";

import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { MapComponent } from "../components/shared/Map";
import { SubHeader } from "../components/SubHeader/SubHeader";

export default function MapPage() {
  const [mapMode, setMapMode] = useState<"total" | "perCapita">("total");

  return (
    <div className="relative w-full">
      <div className="p-4">
        <SubHeader />
      </div>
      <div className="absolute bottom-4 left-4  z-10">
        <div className="flex items-center gap-3 bg-neutral-900 rounded-md px-3 py-2 text-sm">
          <span
            className={mapMode === "total" ? "text-white" : "text-neutral-400"}
          >
            Total Visits
          </span>
          <Switch
            checked={mapMode === "perCapita"}
            onCheckedChange={(checked) =>
              setMapMode(checked ? "perCapita" : "total")
            }
            className="data-[state=checked]:bg-accent-400"
          />
          <span
            className={
              mapMode === "perCapita" ? "text-white" : "text-neutral-400"
            }
          >
            Per Capita
          </span>
        </div>
      </div>
      <MapComponent height="calc(100vh - 45px - 76px - 40px)" mode={mapMode} />
    </div>
  );
}
