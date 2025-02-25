"use client";

import { useGetDevices } from "@/hooks/api";
import { StandardCard } from "../../shared/StandardCard";

export function Devices() {
  const { data, isLoading } = useGetDevices();
  return (
    <StandardCard
      filterParameter="device_type"
      isLoading={isLoading}
      title="Devices"
      data={data}
      getValue={(e) => e.device_type}
      getKey={(e) => e.device_type}
      getLabel={(e) => e.device_type || "Other"}
    />
  );
}
