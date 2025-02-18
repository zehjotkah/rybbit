"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { addSite, useGetSites } from "../../hooks/api";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { AlertCircle } from "lucide-react";

/**
 * A simple domain validation function:
 * - Ensures at least one dot separator
 * - Allows subdomains (e.g. sub.example.com)
 * - Requires the TLD to be alphabetical (e.g. .com)
 */
function isValidDomain(domain: string): boolean {
  const domainRegex =
    /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
}

export function AddSite() {
  const { data: sites, refetch } = useGetSites();

  const existingSites = sites?.data?.map((site) => site.domain);

  const [open, setOpen] = useState(false);
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");

  const domainMatchesExistingSites = existingSites?.includes(domain);

  const handleSubmit = async () => {
    setError("");

    // Validate before attempting to add
    if (!isValidDomain(domain)) {
      setError(
        "Invalid domain format. Must be a valid domain like example.com or sub.example.com"
      );
      return;
    }

    const response = await addSite(domain, domain);
    if (!response.ok) {
      const errorMessage = await response.json();
      setError(errorMessage.error);
      return;
    }
    setOpen(false);
    refetch();
  };

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          setDomain("");
          setError("");
        }}
      >
        <DialogTrigger asChild>
          <Button>Add Website</Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Website</DialogTitle>
          </DialogHeader>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="domain">Domain</Label>
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com or sub.example.com"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Adding Website</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => setOpen(false)}
              variant={"ghost"}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={!domain || domainMatchesExistingSites}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
