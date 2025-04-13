"use client";

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
  return (
    <div className="md:hidden">
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
    </div>
  );
}
