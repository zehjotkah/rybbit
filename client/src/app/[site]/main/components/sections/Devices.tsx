"use client";

import { useSingleCol } from "@/hooks/api";
import { StandardCard } from "../../../components/shared/StandardCard";

export function Devices() {
  const { data, isFetching } = useSingleCol({ parameter: "device_type" });
  return (
    <StandardCard
      filterParameter="device_type"
      isFetching={isFetching}
      title="Devices"
      data={data}
      getValue={(e) => e.value}
      getKey={(e) => e.value}
      getLabel={(e) => e.value || "Other"}
    />
  );
}
