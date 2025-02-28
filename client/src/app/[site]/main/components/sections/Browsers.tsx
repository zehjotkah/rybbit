"use client";

import { useSingleCol } from "@/hooks/api";
import { StandardCard } from "../../../components/shared/StandardCard";
import { Browser } from "../../../components/shared/icons/Browser";

export function Browsers() {
  const { data, isFetching } = useSingleCol({ parameter: "browser" });

  return (
    <StandardCard
      title="Browsers"
      data={data}
      isFetching={isFetching}
      getKey={(e) => e.value}
      getLabel={(e) => (
        <div className="flex gap-2 items-center">
          <Browser browser={e.value} />
          {e.value || "Other"}
        </div>
      )}
      getValue={(e) => e.value}
      filterParameter="browser"
    />
  );
}
