"use client";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../../components/ui/basic-tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import { StandardSection } from "../../../components/shared/StandardSection";

type Tab = "referrers";

export function Referrers() {
  const [tab, setTab] = useState<Tab>("referrers");
  return (
    <Card className="h-[493px]">
      <CardHeader>
        <CardTitle>Referrers</CardTitle>
      </CardHeader>
      <CardContent className="mt-[-8px]">
        <Tabs
          defaultValue="referrers"
          value={tab}
          onValueChange={(value) => setTab(value as Tab)}
        >
          <TabsList>
            <TabsTrigger value="referrers">Referrers</TabsTrigger>
          </TabsList>
          <TabsContent value="referrers">
            <StandardSection
              filterParameter="referrer"
              title="Referrers"
              getValue={(e) => e.value}
              getKey={(e) => e.value}
              getLabel={(e) => (
                <div className="flex items-center">
                  <img
                    className="w-4 mr-2"
                    src={`https://www.google.com/s2/favicons?domain=${e.value}&sz=32`}
                  />
                  {e.value ? e.value : "Direct"}
                </div>
              )}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
