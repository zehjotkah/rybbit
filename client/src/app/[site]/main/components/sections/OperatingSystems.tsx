"use client";

import { useSingleCol } from "@/hooks/api";
import { StandardCard } from "../../../components/shared/StandardCard";
import { OperatingSystem } from "../../../components/shared/icons/OperatingSystem";

export function OperatingSystems() {
  const { data, isFetching } = useSingleCol({ parameter: "operating_system" });

  return (
    <StandardCard
      title="Operating Systems"
      data={data}
      isFetching={isFetching}
      getValue={(e) => e.value}
      getKey={(e) => e.value}
      getLabel={(e) => (
        <div className="flex gap-2 items-center">
          <OperatingSystem os={e.value || "Other"} />
          {e.value || "Other"}
        </div>
      )}
      filterParameter="operating_system"
    />
  );
}
