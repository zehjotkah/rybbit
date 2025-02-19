"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "../../lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GearSix, User } from "@phosphor-icons/react";

import { Input } from "../../components/ui/input";
import { Account } from "./account/Account";

export default function SettingsPage() {
  const session = authClient.useSession();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<
    "account" | "settings" | "users"
  >("account");

  return (
    <div className="max-w-6xl">
      <div className="grid grid-cols-[200px_1fr] gap-6">
        <div className="flex flex-col gap-2">
          <Button
            variant={selectedTab === "account" ? "default" : "ghost"}
            onClick={() => setSelectedTab("account")}
            className="justify-start"
          >
            <User size={16} weight="bold" />
            Account
          </Button>
          <Button
            variant={selectedTab === "settings" ? "default" : "ghost"}
            onClick={() => setSelectedTab("settings")}
            className="justify-start"
          >
            <GearSix size={16} weight="bold" />
            Settings
          </Button>
        </div>
        {selectedTab === "account" && session.data?.user && (
          <Account session={session} />
        )}
      </div>
      {/* <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your analytics preferences and configurations.
          </p>
        </div>
        <Button
          onClick={async () => {
            await authClient.signOut();
            router.push("/login");
          }}
        >
          Signout
        </Button>

        <div className="flex gap-2 flex-col">
          <Button>Test</Button>
          <Button variant={"destructive"}>Test</Button>
          <Button variant={"accent"}>Test</Button>
          <Button variant={"warning"}>Test</Button>
          <Button variant={"ghost"}>Test</Button>
          <Button variant={"link"}>Test</Button>
          <Button variant={"outline"}>Test</Button>
          <Button variant={"secondary"}>Test</Button>
        </div>
      </div> */}
    </div>
  );
}
