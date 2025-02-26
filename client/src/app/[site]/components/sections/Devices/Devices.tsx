"use client";

import { useSingleCol } from "@/hooks/api";
import { StandardCard } from "../../shared/StandardCard";

export function Devices() {
  const { data, isLoading } = useSingleCol({ parameter: "device_type" });
  return (
    <StandardCard
      filterParameter="device_type"
      isLoading={isLoading}
      title="Devices"
      data={data}
      getValue={(e) => e.value}
      getKey={(e) => e.value}
      getLabel={(e) => e.value || "Other"}
    />
  );
}
