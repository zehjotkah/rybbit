"use client";

import { GetSitesResponse, useSingleCol } from "@/hooks/api";
import { StandardCard } from "../../../components/shared/StandardCard";

export function Pages({
  siteMetadata,
}: {
  siteMetadata: GetSitesResponse[number];
}) {
  const { data, isFetching } = useSingleCol({ parameter: "pathname" });

  return (
    <StandardCard
      filterParameter="pathname"
      title="Pages"
      data={data}
      isFetching={isFetching}
      getValue={(e) => e.value}
      getKey={(e) => e.value}
      getLabel={(e) => e.value || "Other"}
      getLink={(e) => `https://${siteMetadata.domain}${e.value}`}
    />
  );
}
