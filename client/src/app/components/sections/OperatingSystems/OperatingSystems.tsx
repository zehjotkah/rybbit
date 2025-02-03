"use client";

import { useGetOperatingSystems } from "../../../hooks/useGetOperatingSystems";
import { StandardCard } from "../../shared/StandardCard";

export function OperatingSystems() {
  const { data, isLoading } = useGetOperatingSystems();
  return (
    <StandardCard
      title="Operating Systems"
      data={data}
      getKey={(e) => e.operating_system}
      getLabel={(e) => e.operating_system || "Other"}
    />
  );
}
