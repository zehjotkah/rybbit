"use client";
import { getCountryName } from "../../../../../lib/utils";
import { StandardSection } from "../../../components/shared/StandardSection/StandardSection";
import { CountryFlag } from "../../../components/shared/icons/CountryFlag";
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

type Tab = "countries" | "regions";

export function Countries() {
  const [tab, setTab] = useState<Tab>("countries");
  return (
    <Card className="">
      {/* <CardHeader>
        <CardTitle>Countries</CardTitle>
      </CardHeader> */}
      <CardContent className="mt-2">
        <Tabs
          defaultValue="countries"
          value={tab}
          onValueChange={(value) => setTab(value as Tab)}
        >
          <TabsList>
            <TabsTrigger value="countries">Countries</TabsTrigger>
            <TabsTrigger value="regions">Regions</TabsTrigger>
          </TabsList>
          <TabsContent value="countries">
            <StandardSection
              filterParameter="country"
              title="Countries"
              getValue={(e) => e.value}
              getKey={(e) => e.value}
              getLabel={(e) => (
                <div className="flex gap-2 items-center">
                  <CountryFlag country={e.value} />
                  {getCountryName(e.value)}
                </div>
              )}
            />
          </TabsContent>
          <TabsContent value="regions"></TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
