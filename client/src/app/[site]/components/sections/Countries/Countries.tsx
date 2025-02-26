"use client";

import { useSingleCol } from "@/hooks/api";
import { countries } from "countries-list";
import * as CountryFlags from "country-flag-icons/react/3x2";
import React from "react";
import { StandardCard } from "../../shared/StandardCard";

export function Countries() {
  const { data, isLoading } = useSingleCol({ parameter: "country" });

  return (
    <StandardCard
      title="Countries"
      data={data}
      isLoading={isLoading}
      getKey={(e) => e.value}
      getLabel={(e) => (
        <span className="flex items-center gap-2">
          {e.value && countries[e.value as keyof typeof countries] ? (
            <>
              {CountryFlags[e.value as keyof typeof CountryFlags]
                ? React.createElement(
                    CountryFlags[e.value as keyof typeof CountryFlags],
                    {
                      title: countries[e.value as keyof typeof countries].name,
                      className: "w-5",
                    }
                  )
                : null}
              {countries[e.value as keyof typeof countries].name}
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
