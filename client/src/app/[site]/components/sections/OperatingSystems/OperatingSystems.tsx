"use client";

import { Compass } from "lucide-react";
import { StandardCard } from "../../shared/StandardCard";
import Image from "next/image";
import { useSingleCol } from "@/hooks/api";

const OS_TO_LOGO: Record<string, string> = {
  Windows: "Windows.svg",
  Android: "Android.svg",
  android: "Android.svg",
  Linux: "Tux.svg",
  macOS: "macOS.png",
  iOS: "Apple.svg",
  "Chrome OS": "Chrome.svg",
  Ubuntu: "Ubuntu.svg",
  HarmonyOS: "HarmonyOS.svg",
  OpenHarmony: "OpenHarmony.png",
  PlayStation: "PlayStation.svg",
  Tizen: "Tizen.png",
};

export function OperatingSystems() {
  const { data, isLoading } = useSingleCol({ parameter: "operating_system" });

  return (
    <StandardCard
      title="Operating Systems"
      data={data}
      isLoading={isLoading}
      getValue={(e) => e.value}
      getKey={(e) => e.value}
      getLabel={(e) => (
        <div className="flex gap-2 items-center">
          {OS_TO_LOGO[e.value] ? (
            <Image
              src={`/operating-systems/${OS_TO_LOGO[e.value]}`}
              alt={e.value || "Other"}
              className="w-4 h-4"
              width={16}
              height={16}
            />
          ) : (
            <Compass width={16} />
          )}
          {e.value || "Other"}
        </div>
      )}
      filterParameter="operating_system"
    />
  );
}
