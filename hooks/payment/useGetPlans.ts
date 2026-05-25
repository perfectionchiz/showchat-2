import { Plan } from "@/models/payment.model";
import { paymentService } from "@/services/payment.service";
import { useQuery } from "@tanstack/react-query";

export const useGetPlans = () => {
  const query = useQuery<{ plans: Plan[] }>({
    queryKey: ["plans"],
    staleTime: 1000 * 60 * 5,
    queryFn: () => paymentService.getPlans(),
  });

  return {
    ...query,
    plans: query.data?.plans ?? [],
    isPlansLoading: query.isLoading || query.isFetching,
  };
};
