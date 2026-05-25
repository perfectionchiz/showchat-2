import { useQuery } from "@tanstack/react-query";

export function useEntitlementMock() {
  return useQuery<{ isPremium: boolean }, Error>({
    queryKey: ["entitlement"],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 500));
      return { isPremium: false };
    },
    staleTime: 1000 * 60 * 5,
  });
}
