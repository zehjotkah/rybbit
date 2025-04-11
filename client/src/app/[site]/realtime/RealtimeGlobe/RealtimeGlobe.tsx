"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { MeshPhongMaterial } from "three";
import { useGetLiveSessionLocations } from "../../../../api/analytics/useGetLiveSessionLocations";
import { useQuery } from "@tanstack/react-query";
import { scaleSequentialSqrt } from "d3-scale";
import {
  interpolateYlOrRd,
  interpolatePuBu,
  interpolateOranges,
} from "d3-scale-chromatic";

export const World = memo(({ width }: { width: number }) => {
  const globeEl = useRef<any>(null);

  const {
    data: liveSessionLocations,
    isLoading: isLiveSessionLocationsLoading,
  } = useGetLiveSessionLocations(60);

  const { data: countries = { features: [] } } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const res = await fetch("/countries.geojson");
      return res.json();
    },
  });

  const highest = liveSessionLocations?.reduce(
    (acc, curr) => Math.max(acc, curr.count),
    0
  );

  const weightColor = scaleSequentialSqrt(interpolateYlOrRd).domain([
    0,
    (highest ?? 0) * 5,
  ]);

  useEffect(() => {
    // Auto-rotate
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.2;
    }
  }, [globeEl.current]);

  const oceanBlueMaterial = useMemo(
    () =>
      new MeshPhongMaterial({
        color: "hsl(220.9, 30.3%, 16%)",
        transparent: false,
        opacity: 1,
      }),
    []
  );

  const liveSessionLocationsData = useMemo(() => {
    return liveSessionLocations?.map((e) => ({
      lat: e.lat,
      lng: e.lon,
      count: e.count,
    }));
  }, [liveSessionLocations]);

  return (
    <div
      onMouseDown={() => {
        if (globeEl.current) {
          globeEl.current.controls().autoRotate = false;
        }
      }}
    >
      <Globe
        onGlobeReady={() => {
          if (globeEl.current) {
            // Set initial view: lat, lng, and altitude (zoom)
            globeEl.current.pointOfView({ lat: 20, lng: -36, altitude: 2 });
          }
        }}
        ref={globeEl as any}
        width={width ?? 0}
        height={width ?? 0}
        atmosphereColor="rgba(170, 170, 200, 1)"
        globeMaterial={oceanBlueMaterial}
        hexPolygonsData={countries.features}
        hexPolygonResolution={3}
        hexPolygonMargin={0.2}
        hexBinMargin={0.2}
        hexBinResolution={3}
        hexBinPointsData={liveSessionLocationsData}
        hexBinMerge={true}
        hexBinPointWeight={"count"}
        backgroundColor="rgba(0, 0, 0, 0)"
        hexPolygonColor={(e) => {
          return `rgba(100, 100, 100, ${Math.random() / 3 + 0.5})`;
        }}
        hexTopColor={(d) => weightColor(d.sumWeight)}
        hexSideColor={(d) => weightColor(d.sumWeight)}
        // @ts-ignore
        hexPolygonLabel={({ properties: d }) => (
          <div className="text-neutral-100 bg-neutral-900 border border-neutral-700 rounded-md p-2 ">
            <div>
              <b>
                {d.ADMIN} ({d.ISO_A2})
              </b>
            </div>
            <div>
              Population: <i>{d.POP_EST}</i>
            </div>
          </div>
        )}
      />
    </div>
  );
});
