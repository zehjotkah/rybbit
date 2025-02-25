"use client";

import { useGetPages } from "@/hooks/api";
import { StandardCard } from "../../shared/StandardCard";

export function Pages() {
  const { data, isLoading } = useGetPages();
  return (
    <StandardCard
      filterParameter="pathname"
      title="Pages"
      data={data}
      isLoading={isLoading}
      getValue={(e) => e.pathname}
      getKey={(e) => e.pathname}
      getLabel={(e) => e.pathname || "Other"}
    />
  );
}
