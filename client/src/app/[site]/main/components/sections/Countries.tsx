"use client";

import { useSingleCol } from "@/hooks/api";
import React from "react";
import { getCountryName } from "../../../../../lib/utils";
import { StandardCard } from "../../../components/shared/StandardCard";
import { CountryFlag } from "../../../components/shared/icons/CountryFlag";

export function Countries() {
  const { data, isFetching } = useSingleCol({ parameter: "country" });

  return (
    <StandardCard
      title="Countries"
      data={data}
      isFetching={isFetching}
      getKey={(e) => e.value}
      getLabel={(e) => (
        <span className="flex items-center gap-2">
          {e.value && getCountryName(e.value) ? (
            <>
              <CountryFlag country={e.value} />
              {getCountryName(e.value)}
            </>
          ) : (
            "Unknown"
          )}
        </span>
      )}
      getValue={(e) => e.value}
      filterParameter="country"
    />
  );
}
