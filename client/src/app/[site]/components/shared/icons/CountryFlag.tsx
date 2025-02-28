import * as CountryFlags from "country-flag-icons/react/3x2";
import React from "react";
import { getCountryName } from "../../../../../lib/utils";

export function CountryFlag({ country }: { country: string }) {
  return (
    <>
      {CountryFlags[country as keyof typeof CountryFlags]
        ? React.createElement(
            CountryFlags[country as keyof typeof CountryFlags],
            {
              title: getCountryName(country),
              className: "w-5",
            }
          )
        : null}
    </>
  );
}
