import { subscriptionService } from "@/services/subscription.service";
import { useQuery } from "@tanstack/react-query";

export const useGetSubscription = (openSub: boolean) => {
  const query = useQuery({
    queryKey: ["subscription"],
    staleTime: 1000 * 60 * 5,
    queryFn: () => subscriptionService.getSubscription(),
    enabled: !!openSub,
  });

  return {
    ...query,
    subscription: query.data,
    isSubscriptionLoading: query.isLoading || query.isFetching,
  };
};
