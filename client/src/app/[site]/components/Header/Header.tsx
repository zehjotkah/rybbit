"use client";
import { usePathname } from "next/navigation";
import { useGetSite } from "../../../../api/admin/sites";

export function Header() {
  const pathname = usePathname();

  const { data: site } = useGetSite(Number(pathname.split("/")[1]));

  return (
    <div className="flex flex-col">{/* <UsageBanners site={site} /> */}</div>
  );
}
