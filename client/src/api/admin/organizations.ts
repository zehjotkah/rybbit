import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "../../lib/const";
import { authedFetch } from "../utils";
import { APIResponse } from "../types";

export type UserOrganization = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  createdAt: string;
  metadata: string | null;
  role: string;
};

export function getUserOrganizations(): Promise<UserOrganization[]> {
  return authedFetch(`${BACKEND_URL}/user/organizations`).then((res) =>
    res.json()
  );
}

export function useUserOrganizations() {
  return useQuery({
    queryKey: ["userOrganizations"],
    queryFn: getUserOrganizations,
  });
}
