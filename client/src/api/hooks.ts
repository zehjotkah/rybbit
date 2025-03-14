import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "../lib/const";
import { useGetSites } from "./api";
import { authedFetch } from "./utils";

export function useGetSiteMetadata(siteId: string | number) {
  const { data, isLoading } = useGetSites();
  return {
    siteMetadata: data?.data?.find((site) => site.siteId === Number(siteId)),
    isLoading,
  };
}

export function useUserOrganizations() {
  const { data: orgsData, isLoading: orgsLoading } = useQuery({
    queryKey: ["userOrganizations"],
    queryFn: () =>
      authedFetch(`${BACKEND_URL}/user/organizations`).then((res) =>
        res.json()
      ),
  });

  return {
    organizations: orgsData?.data || [],
    isLoading: orgsLoading,
  };
}
