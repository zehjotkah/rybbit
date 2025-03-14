import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "../../lib/const";
import { authedFetch } from "../utils";

type GetOrganizationMembersResponse = {
  data: {
    id: string;
    role: string;
    userId: string;
    organizationId: string;
    createdAt: string;
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  }[];
};

export const useOrganizationMembers = (organizationId: string) => {
  return useQuery<GetOrganizationMembersResponse>({
    queryKey: ["organization-members", organizationId],
    queryFn: () =>
      authedFetch(
        `${BACKEND_URL}/list-organization-members/${organizationId}`
      ).then((res) => res.json()),
    staleTime: Infinity,
  });
};
