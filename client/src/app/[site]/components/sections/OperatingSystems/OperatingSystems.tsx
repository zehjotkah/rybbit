"use client";

import { Compass } from "lucide-react";
import { StandardCard } from "../../shared/StandardCard";
import Image from "next/image";
import { useGetOperatingSystems } from "@/hooks/api";

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
  const { data, isLoading } = useGetOperatingSystems();
  return (
    <StandardCard
      title="Operating Systems"
      data={data}
      isLoading={isLoading}
      getValue={(e) => e.operating_system}
      getKey={(e) => e.operating_system}
      getLabel={(e) => (
        <div className="flex gap-2 items-center">
          {OS_TO_LOGO[e.operating_system] ? (
            <Image
              src={`/operating-systems/${OS_TO_LOGO[e.operating_system]}`}
              alt={e.operating_system || "Other"}
              className="w-4 h-4"
              width={16}
              height={16}
            />
          ) : (
            <Compass width={16} />
          )}
          {e.operating_system || "Other"}
        </div>
      )}
      filterParameter="operating_system"
    />
  );
}
