"use client";

import { useSingleCol } from "@/hooks/api";
import { StandardCard } from "../../shared/StandardCard";

export function Referrers() {
  const { data, isLoading } = useSingleCol({ parameter: "referrer" });
  return (
    <StandardCard
      filterParameter="referrer"
      title="Referrers"
      data={data}
      getKey={(e) => e.value}
      isLoading={isLoading}
      getLabel={(e) => (
        <div className="flex items-center">
          <img
            className="w-4 mr-2"
            src={`https://www.google.com/s2/favicons?domain=${e.value}&sz=32`}
          />
          {e.value ? (
            <a
              href={`https://${e.value}`}
              target="_blank"
              className="hover:underline"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {e.value}
            </a>
          ) : (
            "Direct"
          )}
        </div>
      )}
      getValue={(e) => e.value}
    />
  );
}
