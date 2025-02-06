"use client";

import { useGetDevices } from "../../../hooks/useGetDevices";
import { StandardCard } from "../../shared/StandardCard";

export function Devices() {
  const { data, isLoading } = useGetDevices();
  return (
    <StandardCard
      isLoading={isLoading}
      title="Devices"
      data={data}
      getKey={(e) => e.device_type}
      getLabel={(e) => e.device_type || "Other"}
    />
  );
}
