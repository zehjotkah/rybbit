"use client";

import { usePathname, useRouter } from "next/navigation";
import { useGetSites } from "../api/admin/sites";
import { Sidebar } from "../app/[site]/components/Sidebar/Sidebar";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

import { Menu } from "lucide-react";
import { VisuallyHidden } from "radix-ui";

export function MobileSidebar() {
  const { data: sites } = useGetSites();
  const pathname = usePathname();
  const currentSiteId = Number(pathname.split("/")[1]);

  const site = sites?.find((site) => site.siteId === currentSiteId);

  return (
    <div className="md:hidden flex items-center gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline">
            <Menu />
          </Button>
        </SheetTrigger>
        <VisuallyHidden.Root>
          <SheetHeader>
            <SheetTitle>Frogstats Sidebar</SheetTitle>
          </SheetHeader>
        </VisuallyHidden.Root>
        <SheetContent side="left" className="p-0 w-[223px]" showClose={false}>
          <Sidebar />
        </SheetContent>
      </Sheet>
      {site && (
        <img
          className="w-6 h-6"
          src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=64`}
          alt={site.domain}
        />
      )}
    </div>
  );
}
