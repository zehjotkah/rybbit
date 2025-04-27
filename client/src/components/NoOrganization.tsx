import { Building, Plus } from "lucide-react";
import { useState } from "react";
import { useUserOrganizations } from "../api/admin/organizations";
import { useGetSites } from "../api/admin/sites";
import { CreateOrganizationDialog } from "./CreateOrganizationDialog";
import { Button } from "./ui/button";
import { Card, CardDescription, CardTitle } from "./ui/card";

export function NoOrganization() {
  const [createOrgDialogOpen, setCreateOrgDialogOpen] = useState(false);
  const { refetch: refetchSites } = useGetSites();
  const { refetch: refetchOrganizations } = useUserOrganizations();

  const handleOrganizationCreated = () => {
    refetchOrganizations();
    refetchSites();
  };
  return (
    <>
      <Card className="col-span-full p-6 flex flex-col items-center text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Building className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="mb-2 text-xl">Organization Required</CardTitle>
        <CardDescription className="mb-6">
          You need to create an organization before you add a website
        </CardDescription>
        <Button
          onClick={() => setCreateOrgDialogOpen(true)}
          className="max-w-xs"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create an Organization
        </Button>
      </Card>
      <CreateOrganizationDialog
        open={createOrgDialogOpen}
        onOpenChange={setCreateOrgDialogOpen}
        onSuccess={handleOrganizationCreated}
      />
    </>
  );
}
