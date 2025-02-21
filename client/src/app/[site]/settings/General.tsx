import { useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { APIResponse, GetSitesResponse } from "../../../hooks/api";
import { DeleteSite } from "./DeleteSite";

export function General({
  site,
}: {
  site: APIResponse<GetSitesResponse>["data"][number];
}) {
  const [domain, setDomain] = useState("");

  const hasChanges = domain !== site.domain;

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-2">
        <CardHeader>
          <CardTitle className="text-xl">General</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="domain">Username</Label>
            <Input
              className="w-60"
              id="domain"
              value={domain}
              onChange={({ target }) => setDomain(target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant={"accent"} disabled={!hasChanges}>
            Save Changes
          </Button>
        </CardFooter>
      </Card>
      <Card className="p-2 pt-6">
        <CardContent className="flex flex-col gap-4">
          <DeleteSite site={site} />
        </CardContent>
      </Card>
    </div>
  );
}
