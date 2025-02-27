"use client";
import { usePathname } from "next/navigation";
import { useGetSites, useSiteHasData } from "../../../hooks/api";
import { useStore } from "../../../lib/store";
import { MainSection } from "../components/MainSection/MainSection";
import { NoData } from "../components/NoData";
import { Browsers } from "../components/sections/Browsers/Browsers";
import { Countries } from "../components/sections/Countries/Countries";
import { Devices } from "../components/sections/Devices/Devices";
import { Map } from "../components/sections/Map/Map";
import { OperatingSystems } from "../components/sections/OperatingSystems/OperatingSystems";
import { Pages } from "../components/sections/Pages/Pages";
import { Referrers } from "../components/sections/Referrers/Referrers";
import { SubHeader } from "../components/SubHeader/SubHeader";
import { useGetSiteMetadata } from "../../../hooks/hooks";

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
