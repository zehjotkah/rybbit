"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useGetSites, useSiteHasData } from "../../hooks/api";
import { useStore } from "../../lib/store";
import { Header } from "./components/Header/Header";
import { MainSection } from "./components/MainSection/MainSection";
import { NoData } from "./components/NoData";
import { Browsers } from "./components/sections/Browsers/Browsers";
import { Countries } from "./components/sections/Countries/Countries";
import { Devices } from "./components/sections/Devices/Devices";
import { Map } from "./components/sections/Map/Map";
import { OperatingSystems } from "./components/sections/OperatingSystems/OperatingSystems";
import { Pages } from "./components/sections/Pages/Pages";
import { Referrers } from "./components/sections/Referrers/Referrers";
import { SubHeader } from "./components/SubHeader/SubHeader";
import { useGetSiteMetadata } from "../../hooks/hooks";

export default function SitePage() {
  const pathname = usePathname();
  const { setSite, site } = useStore();

  useEffect(() => {
    if (pathname.includes("/")) {
      setSite(pathname.split("/")[1]);
    }
  }, [pathname]);

  if (!site) {
    return null;
  }

  return <SitePageInner site={site} />;
}

function SitePageInner({ site }: { site: string }) {
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
      <Header />
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
