import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BACKEND_URL } from "../../lib/const";
import { authedFetchWithError } from "../utils";

/**
 * Hook for deleting a saved funnel report
 */
export function useDeleteFunnel() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, number>({
    mutationFn: async (reportId) => {
      try {
        return await authedFetchWithError<{ success: boolean }>(
          `${BACKEND_URL}/report/${reportId}`,
          {
            method: "DELETE",
          }
        );
      } catch (error) {
        console.error(error);
        throw new Error("Failed to delete funnel");
      }
    },
    onSuccess: () => {
      // Invalidate the funnels query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["funnels"] });
    },
  });
}
