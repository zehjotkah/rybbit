"use client";
import { usePathname } from "next/navigation";
import { Header } from "./components/Header/Header";
import { MainSection } from "./components/MainSection/MainSection";
import { Browsers } from "./components/sections/Browsers/Browsers";
import { Countries } from "./components/sections/Countries/Countries";
import { Devices } from "./components/sections/Devices/Devices";
import { Map } from "./components/sections/Map/Map";
import { OperatingSystems } from "./components/sections/OperatingSystems/OperatingSystems";
import { Pages } from "./components/sections/Pages/Pages";
import { Referrers } from "./components/sections/Referrers/Referrers";
import { useStore } from "../../lib/store";
import { useEffect } from "react";

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

  return (
    <>
      <Header />
      <MainSection />
      <div className="grid grid-cols-2 gap-4 mt-4">
        <OperatingSystems />
        <Browsers />
        <Devices />
        <Pages />
        <Referrers />
        <Countries />
        <Map />
        {/* <Chloropleth /> */}
      </div>
    </>
  );
}
