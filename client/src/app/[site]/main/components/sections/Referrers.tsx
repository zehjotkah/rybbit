"use client";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../../components/ui/basic-tabs";
import { Card, CardContent } from "../../../../../components/ui/card";
import { StandardSection } from "../../../components/shared/StandardSection/StandardSection";
import { StandardSectionRealtime } from "../../../components/shared/StandardSection/StandardSectionRealtime";

type Tab =
  | "referrers"
  | "channels"
  | "utm_source"
  | "utm_medium"
  | "utm_campaign"
  | "utm_term"
  | "utm_content";

export function Referrers({ isRealtime = false }: { isRealtime?: boolean }) {
  const [tab, setTab] = useState<Tab>("referrers");

  const ComponentToUse = isRealtime ? StandardSectionRealtime : StandardSection;

  return (
    <Card className="h-[445px]">
      <CardContent className="mt-2">
        <Tabs
          defaultValue="referrers"
          value={tab}
          onValueChange={(value) => setTab(value as Tab)}
        >
          <TabsList>
            <TabsTrigger value="referrers">Referrers</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="utm_source">Source</TabsTrigger>
            <TabsTrigger value="utm_medium">Medium</TabsTrigger>
            <TabsTrigger value="utm_campaign">Campaign</TabsTrigger>
            <TabsTrigger value="utm_term">Term</TabsTrigger>
            <TabsTrigger value="utm_content">Content</TabsTrigger>
          </TabsList>
          <TabsContent value="referrers">
            <ComponentToUse
              filterParameter="referrer"
              title="Referrers"
              getValue={(e) => e.value}
              getKey={(e) => e.value}
              getLink={(e) => `https://${e.value}`}
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
          <TabsContent value="channels">
            <ComponentToUse
              filterParameter="channel"
              title="Channels"
              getValue={(e) => e.value}
              getKey={(e) => e.value}
              // getLink={(e) => `https://${e.value}`}
              getLabel={(e) => (
                <div className="flex items-center">{e.value}</div>
              )}
            />
          </TabsContent>
          <TabsContent value="utm_source">
            <ComponentToUse
              filterParameter="utm_source"
              title="UTM Source"
              getKey={(e) => e.value}
              getLabel={(e) => e.value}
              getValue={(e) => e.value}
            />
          </TabsContent>
          <TabsContent value="utm_medium">
            <ComponentToUse
              filterParameter="utm_medium"
              title="UTM Medium"
              getKey={(e) => e.value}
              getLabel={(e) => e.value}
              getValue={(e) => e.value}
            />
          </TabsContent>
          <TabsContent value="utm_campaign">
            <ComponentToUse
              filterParameter="utm_campaign"
              title="UTM Campaign"
              getKey={(e) => e.value}
              getLabel={(e) => e.value}
              getValue={(e) => e.value}
            />
          </TabsContent>
          <TabsContent value="utm_content">
            <ComponentToUse
              filterParameter="utm_content"
              title="UTM Content"
              getKey={(e) => e.value}
              getLabel={(e) => e.value}
              getValue={(e) => e.value}
            />
          </TabsContent>
          <TabsContent value="utm_term">
            <ComponentToUse
              filterParameter="utm_term"
              title="UTM Term"
              getKey={(e) => e.value}
              getLabel={(e) => e.value}
              getValue={(e) => e.value}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
