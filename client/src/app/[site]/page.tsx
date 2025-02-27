"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function SiteRedirect() {
  const router = useRouter();
  const params = useParams();
  const siteId = params.site;

  useEffect(() => {
    if (siteId) {
      router.replace(`/${siteId}/main`);
    }
  }, [siteId, router]);

  return null;
}
