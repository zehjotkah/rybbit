"use client";

import { useSingleCol } from "@/hooks/api";
import { StandardCard } from "../../../components/shared/StandardCard";

export function Referrers() {
  const { data, isFetching } = useSingleCol({ parameter: "referrer" });
  return (
    <StandardCard
      filterParameter="referrer"
      title="Referrers"
      data={data}
      getKey={(e) => e.value}
      isFetching={isFetching}
      getLink={(e) => `https://${e.value}`}
      getLabel={(e) => (
        <div className="flex items-center">
          <img
            className="w-4 mr-2"
            src={`https://www.google.com/s2/favicons?domain=${e.value}&sz=32`}
          />
          {e.value ? e.value : "Direct"}
        </div>
      )}
      getValue={(e) => e.value}
    />
  );
}
