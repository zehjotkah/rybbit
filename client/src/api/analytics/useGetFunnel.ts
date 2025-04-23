import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BACKEND_URL } from "../../lib/const";
import { authedFetch } from "../utils";
import { useStore, Filter } from "../../lib/store";
import { useDebounce } from "@uidotdev/usehooks";

export type FunnelStep = {
  value: string;
  name?: string;
  type: "page" | "event";
};

export type FunnelRequest = {
  steps: FunnelStep[];
  startDate: string | null;
  endDate: string | null;
  name?: string;
  filters?: Filter[];
};

export type SaveFunnelRequest = {
  steps: FunnelStep[];
  startDate: string;
  endDate: string;
  name: string;
  reportId?: number;
  filters?: Filter[];
};

export type FunnelResponse = {
  step_number: number;
  step_name: string;
  visitors: number;
  conversion_rate: number;
  dropoff_rate: number;
};

/**
 * Hook for analyzing conversion funnels through a series of steps
 */
export function useGetFunnel(config?: FunnelRequest, debounce?: boolean) {
  const { site } = useStore();

  const debouncedConfig = useDebounce(config, 500);

  const configToUse = debounce ? debouncedConfig : config;

  return useQuery<{ data: FunnelResponse[] }, Error>({
    queryKey: [
      "funnel",
      site,
      configToUse?.filters,
      configToUse?.startDate,
      configToUse?.endDate,
      configToUse?.filters,
      configToUse?.steps.map((s) => s.value + s.type),
    ],
    queryFn: async () => {
      if (!configToUse) {
        throw new Error("Funnel configuration is required");
      }

      // Add timezone to the request
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const fullConfig = {
        ...configToUse,
        timezone,
      };

      const response = await authedFetch(`${BACKEND_URL}/funnel/${site}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fullConfig),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze funnel");
      }

      return response.json();
    },
    enabled: !!site && !!configToUse,
  });
}

/**
 * Hook for saving funnel configurations without analyzing them
 */
export function useSaveFunnel() {
  const { site } = useStore();
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; funnelId: number },
    Error,
    SaveFunnelRequest
  >({
    mutationFn: async (funnelConfig) => {
      // Add timezone to the request
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const fullConfig = {
        ...funnelConfig,
        timezone,
      };

      // Save the funnel configuration
      const saveResponse = await authedFetch(
        `${BACKEND_URL}/funnel/create/${site}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fullConfig),
        }
      );

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || "Failed to save funnel");
      }

      // Invalidate the funnels query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["funnels", site] });

      return saveResponse.json();
    },
  });
}
