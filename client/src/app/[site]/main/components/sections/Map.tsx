"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardLoader,
  CardTitle,
} from "@/components/ui/card";
import * as CountryFlags from "country-flag-icons/react/3x2";
import { scaleLinear } from "d3-scale";
import { Feature, Geometry } from "geojson";
import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  ZoomableGroup,
} from "react-simple-maps";

import { useSingleCol } from "@/hooks/api";
import React from "react";
import { getCountryName } from "../../../../../lib/utils";

const geoUrl = "/countries.geojson";

interface TooltipData {
  name: string;
  count: number;
  percentage: number;
  x: number;
  y: number;
}

export function Map() {
  const { data, isLoading } = useSingleCol({ parameter: "country" });
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

  const colorScale = useMemo(() => {
    if (!data?.data) return () => "#eee";
    const maxValue = Math.max(...data.data.map((d) => d.count));
    return scaleLinear<string>()
      .domain([0, maxValue])
      .range(["rgba(232, 121, 249, 0.3)", "rgb(232, 121, 249)"]);
  }, [data?.data]);

  return (
    <Card>
      {isLoading && <CardLoader />}
      <CardHeader>
        <CardTitle>Map</CardTitle>
      </CardHeader>
      <CardContent>
        {data?.data ? (
          <>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                rotate: [-10, 0, 0],
                scale: 120,
              }}
            >
              <Sphere stroke="hsl(var(--neutral-800))" strokeWidth={0.5} />
              <ZoomableGroup>
                <Geographies geography={geoUrl}>
                  {({
                    geographies,
                  }: {
                    geographies: Array<Feature<Geometry>>;
                  }) =>
                    geographies.map((geo, index) => {
                      const foundCountry = data?.data?.find(
                        ({ value }) => value === geo.properties?.["ISO_A2"]
                      );
                      const count = foundCountry?.count || 0;
                      const percentage = foundCountry?.percentage || 0;

                      return (
                        <Geography
                          key={index}
                          geography={geo}
                          fill={
                            count > 0
                              ? colorScale(count)
                              : "rgba(140, 140, 140, 0.5)"
                          }
                          stroke="hsl(var(--neutral-800))"
                          strokeWidth={0.5}
                          style={{
                            default: {
                              outline: "none",
                            },
                            hover: {
                              outline: "none",
                            },
                            pressed: {
                              outline: "none",
                            },
                          }}
                          onMouseEnter={(evt: any) => {
                            const { pageX, pageY } = evt;
                            setTooltipData({
                              name: geo.properties?.["ISO_A2"],
                              count,
                              percentage,
                              x: pageX,
                              y: pageY,
                            });
                          }}
                          onMouseLeave={() => {
                            setTooltipData(null);
                          }}
                          onMouseMove={(evt: any) => {
                            const { pageX, pageY } = evt;
                            setTooltipData((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    x: pageX,
                                    y: pageY,
                                  }
                                : null
                            );
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
            {tooltipData && (
              <div
                className="absolute pointer-events-none z-50 bg-neutral-800 rounded-md p-2 shadow-lg text-sm"
                style={{
                  left: tooltipData.x,
                  top: tooltipData.y - 5,
                  transform: "translate(0, -100%)",
                }}
              >
                <div className="font-sm flex items-center gap-1">
                  {CountryFlags[tooltipData.name as keyof typeof CountryFlags]
                    ? React.createElement(
                        CountryFlags[
                          tooltipData.name as keyof typeof CountryFlags
                        ],
                        {
                          title: getCountryName(tooltipData.name),
                          className: "w-4",
                        }
                      )
                    : null}
                  {getCountryName(tooltipData.name)}
                </div>
                <>
                  <div>
                    <span className="font-bold text-fuchsia-400">
                      {tooltipData.count.toLocaleString()}
                    </span>{" "}
                    <span className="text-neutral-300">
                      ({tooltipData.percentage.toFixed(1)}%) pageviews
                    </span>
                  </div>
                </>
              </div>
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
