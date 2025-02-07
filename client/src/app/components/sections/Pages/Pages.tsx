"use client";

import { useGetPages } from "../../../../hooks/useGetPages";
import { StandardCard } from "../../shared/StandardCard";

export function Pages() {
  const { data, isLoading } = useGetPages();
  return (
    <StandardCard
      title="Pages"
      data={data}
      isLoading={isLoading}
      getKey={(e) => e.pathname}
      getLabel={(e) => e.pathname || "Other"}
    />
  );
}
