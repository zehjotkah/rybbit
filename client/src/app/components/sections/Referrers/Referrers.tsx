"use client";

import { useGetReferrers } from "../../../../hooks/api";
import { StandardCard } from "../../shared/StandardCard";

export function Referrers() {
  const { data, isLoading } = useGetReferrers();
  return (
    <StandardCard
      title="Referrers"
      data={data}
      getKey={(e) => e.referrer}
      isLoading={isLoading}
      getLabel={(e) => (
        <div className="flex items-center">
          <img
            className="w-4 mr-2"
            src={`https://www.google.com/s2/favicons?domain=${e.referrer}&sz=32`}
          />
          {e.referrer ? (
            <a
              href={`https://${e.referrer}`}
              target="_blank"
              className="hover:underline"
            >
              {e.referrer}
            </a>
          ) : (
            "Direct"
          )}
        </div>
      )}
    />
  );
}
