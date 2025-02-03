"use client";

import { useGetBrowsers } from "../../../hooks/useGetBrowsers";
import { StandardCard } from "../../shared/StandardCard";

export function Browsers() {
  const { data, isLoading } = useGetBrowsers();

  return (
    <StandardCard
      title="Browsers"
      data={data}
      getKey={(e) => e.browser}
      getLabel={(e) => e.browser || "Other"}
    />
  );
}
