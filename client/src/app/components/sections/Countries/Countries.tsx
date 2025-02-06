"use client";

import React from "react";
import { useGetCountries } from "../../../hooks/useGetCountries";
import { StandardCard } from "../../shared/StandardCard";
import { countries } from "countries-list";
import * as CountryFlags from "country-flag-icons/react/3x2";

export function Countries() {
  const { data, isLoading } = useGetCountries();

  return (
    <StandardCard
      title="Countries"
      data={data}
      isLoading={isLoading}
      getKey={(e) => e.country}
      getLabel={(e) => (
        <span className="flex items-center gap-2">
          {e.country && countries[e.country as keyof typeof countries] ? (
            <>
              {CountryFlags[e.country as keyof typeof CountryFlags]
                ? React.createElement(
                    CountryFlags[e.country as keyof typeof CountryFlags],
                    {
                      title:
                        countries[e.country as keyof typeof countries].name,
                      className: "w-5",
                    }
                  )
                : null}
              {countries[e.country as keyof typeof countries].name}
            </>
          ) : (
            "Unknown"
          )}
        </span>
      )}
    />
  );
}
