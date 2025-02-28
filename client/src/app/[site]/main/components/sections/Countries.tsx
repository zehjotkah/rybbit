"use client";

import { useSingleCol } from "@/hooks/api";
import * as CountryFlags from "country-flag-icons/react/3x2";
import React from "react";
import { getCountryName } from "../../../../../lib/utils";
import { StandardCard } from "../../../components/shared/StandardCard";

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
              {CountryFlags[e.value as keyof typeof CountryFlags]
                ? React.createElement(
                    CountryFlags[e.value as keyof typeof CountryFlags],
                    {
                      title: getCountryName(e.value),
                      className: "w-5",
                    }
                  )
                : null}
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
