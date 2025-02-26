"use client";

import { useSingleCol } from "@/hooks/api";
import { StandardCard } from "../../shared/StandardCard";

export function Pages() {
  const { data, isLoading } = useSingleCol("pathname");

  return (
    <StandardCard
      filterParameter="pathname"
      title="Pages"
      data={data}
      isLoading={isLoading}
      getValue={(e) => e.value}
      getKey={(e) => e.value}
      getLabel={(e) => e.value || "Other"}
    />
  );
}
