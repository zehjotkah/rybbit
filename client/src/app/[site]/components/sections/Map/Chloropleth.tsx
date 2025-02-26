"use client";

import { useSingleCol } from "@/hooks/api";
import { scaleLinear } from "d3-scale";
import { Feature, FeatureCollection } from "geojson";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
  }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  {
    ssr: false,
  }
);

const GeoJSON = dynamic(
  () => import("react-leaflet").then((mod) => mod.GeoJSON),
  {
    ssr: false,
  }
);

export function Chloropleth() {
  const { data, isLoading } = useSingleCol({ parameter: "country" });
  const [geoJson, setGeoJson] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    // Load GeoJSON data
    fetch("/countries.geojson")
      .then((res) => res.json())
      .then((data) => setGeoJson(data));
  }, []);

  const countryData = useMemo(() => {
    if (!data?.data) return new Map();
    return new Map(data.data.map((item) => [item.value, item]));
  }, [data?.data]);

  const colorScale = useMemo(() => {
    if (!data?.data) return () => "#eee";
    const maxValue = Math.max(...data.data.map((d) => d.count));
    return scaleLinear<string>()
      .domain([0, maxValue])
      .range(["hsl(var(--fuchsia-100))", "hsl(var(--fuchsia-600))"]);
  }, [data?.data]);

  const style = (feature: Feature<any, any> | undefined) => {
    const countryName = feature?.properties?.name;
    const countryStats = countryData.get(countryName);
    return {
      fillColor: countryStats ? colorScale(countryStats.count) : "#eee",
      weight: 1,
      opacity: 1,
      color: "hsl(var(--neutral-800))",
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature: Feature, layer: any) => {
    const countryName = feature.properties?.name;
    const countryStats = countryData.get(countryName);

    layer.bindTooltip(
      `<div class="p-2">
        <div class="font-bold">${countryName}</div>
        ${
          countryStats
            ? `<div>Pageviews: ${countryStats.count.toLocaleString()}</div>
               <div>Percentage: ${countryStats.percentage.toFixed(1)}%</div>`
            : "No data"
        }
      </div>`,
      { sticky: true }
    );
  };

  if (isLoading || !geoJson) return <div>Loading...</div>;

  return (
    <div className="h-[400px] w-full rounded-lg border overflow-hidden">
      <MapContainer
        center={[20, 0] as LatLngExpression}
        zoom={2}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <GeoJSON data={geoJson} style={style} onEachFeature={onEachFeature} />
      </MapContainer>
    </div>
  );
}
