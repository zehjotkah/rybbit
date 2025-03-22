"use client";

import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../../components/ui/basic-tabs";
import { StandardSection } from "../../../components/shared/StandardSection";
import { OperatingSystem } from "../../../components/shared/icons/OperatingSystem";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import { Browser } from "../../../components/shared/icons/Browser";
import { Monitor, Smartphone, Tablet } from "lucide-react";

type Tab = "devices" | "browsers" | "os" | "dimensions";

export function Devices() {
  const [tab, setTab] = useState<Tab>("devices");
  return (
    <Card className="h-[493px]">
      <CardHeader>
        <CardTitle>Devices</CardTitle>
      </CardHeader>
      <CardContent className="mt-[-8px]">
        <Tabs
          defaultValue="devices"
          value={tab}
          onValueChange={(value) => setTab(value as Tab)}
        >
          <TabsList>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="browsers">Browsers</TabsTrigger>
            <TabsTrigger value="os">Operating Systems</TabsTrigger>
            <TabsTrigger value="dimensions">Screen Dimensions</TabsTrigger>
          </TabsList>
          <TabsContent value="devices">
            <StandardSection
              type="sessions"
              filterParameter="device_type"
              title="Devices"
              getValue={(e) => e.value}
              getKey={(e) => e.value}
              getLabel={(e) => (
                <div className="flex gap-2 items-center">
                  {e.value === "Desktop" && <Monitor className="w-4 h-4" />}
                  {e.value === "Mobile" && <Smartphone className="w-4 h-4" />}
                  {e.value === "Tablet" && <Tablet className="w-4 h-4" />}
                  {e.value || "Other"}
                </div>
              )}
            />
          </TabsContent>
          <TabsContent value="browsers">
            <StandardSection
              type="sessions"
              filterParameter="browser"
              title="Browsers"
              getValue={(e) => e.value}
              getKey={(e) => e.value}
              getLabel={(e) => (
                <div className="flex gap-2 items-center">
                  <Browser browser={e.value} />
                  {e.value || "Other"}
                </div>
              )}
            />
          </TabsContent>
          <TabsContent value="os">
            <StandardSection
              type="sessions"
              title="Operating Systems"
              getValue={(e) => e.value}
              getKey={(e) => e.value}
              getLabel={(e) => (
                <div className="flex gap-2 items-center">
                  <OperatingSystem os={e.value || "Other"} />
                  {e.value || "Other"}
                </div>
              )}
              filterParameter="operating_system"
            />
          </TabsContent>
          <TabsContent value="dimensions">
            <StandardSection
              type="sessions"
              title="Screen Dimensions"
              getValue={(e) => e.value}
              getKey={(e) => e.value}
              getLabel={(e) => (
                <div className="flex gap-2 items-center">
                  {e.value || "Other"}
                </div>
              )}
              filterParameter="dimensions"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
