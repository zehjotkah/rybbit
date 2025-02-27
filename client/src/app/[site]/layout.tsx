"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useStore } from "../../lib/store";
import { Header } from "./components/Header/Header";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      {children}
    </>
  );
}
