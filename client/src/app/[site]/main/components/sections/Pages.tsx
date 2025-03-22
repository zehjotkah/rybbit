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
import { GetSitesResponse } from "../../../../../api/admin/sites";

type Tab = "pages";

export function Pages({
  siteMetadata,
}: {
  siteMetadata: GetSitesResponse[number];
}) {
  const [tab, setTab] = useState<Tab>("pages");
  return (
    <Card className="h-[493px]">
      <CardHeader>
        <CardTitle>Pages</CardTitle>
      </CardHeader>
      <CardContent className="mt-[-8px]">
        <Tabs
          defaultValue="pages"
          value={tab}
          onValueChange={(value) => setTab(value as Tab)}
        >
          <TabsList>
            <TabsTrigger value="pages">Pages</TabsTrigger>
          </TabsList>
          <TabsContent value="pages">
            <StandardSection
              filterParameter="pathname"
              title="pages"
              getValue={(e) => e.value}
              getKey={(e) => e.value}
              getLabel={(e) => e.value || "Other"}
              getLink={(e) => `https://${siteMetadata.domain}${e.value}`}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
