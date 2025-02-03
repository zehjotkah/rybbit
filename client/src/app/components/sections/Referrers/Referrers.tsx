"use client";

import { useGetReferrers } from "../../../hooks/useGetReferrers";
import { StandardCard } from "../../shared/StandardCard";

export function Referrers() {
  const { data, isLoading } = useGetReferrers();
  return (
    <StandardCard
      title="Referrers"
      data={data}
      getKey={(e) => e.referrer}
      getLabel={(e) => e.referrer || "Other"}
    />
  );
}
