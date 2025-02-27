"use client";
import { usePathname } from "next/navigation";
import { useGetSites, useSiteHasData } from "../../../hooks/api";
import { useStore } from "../../../lib/store";
import { NoData } from "../components/NoData";
import { Browsers } from "./components/sections/Browsers";
import { Countries } from "./components/sections/Countries";
import { Devices } from "./components/sections/Devices";
import { Map } from "./components/sections/Map";
import { OperatingSystems } from "./components/sections/OperatingSystems";
import { Pages } from "./components/sections/Pages";
import { Referrers } from "./components/sections/Referrers";
import { SubHeader } from "../components/SubHeader/SubHeader";
import { useGetSiteMetadata } from "../../../hooks/hooks";
import { MainSection } from "./components/MainSection/MainSection";

export default function MainPage() {
  const { site } = useStore();

  if (!site) {
    return null;
  }

  return <MainPageContent site={site} />;
}

function MainPageContent({ site }: { site: string }) {
  const { data: siteHasData, isLoading } = useSiteHasData(site);

  const { siteMetadata, isLoading: isLoadingSiteMetadata } =
    useGetSiteMetadata(site);

  if (isLoadingSiteMetadata || isLoading || !siteMetadata) {
    return null;
  }

  if (!siteHasData?.data && !isLoading && !isLoadingSiteMetadata) {
    return <NoData siteMetadata={siteMetadata} />;
  }

  return (
    <>
      <SubHeader />
      <MainSection />
      <div className="grid grid-cols-2 gap-4 mt-4">
        <OperatingSystems />
        <Browsers />
        <Devices />
        <Pages siteMetadata={siteMetadata} />
        <Referrers />
        <Countries />
        <Map />
        {/* <Chloropleth /> */}
      </div>
    </>
  );
}
