import { useToast } from "@/components/context/ToastContext";
import { subscriptionService } from "@/services/subscription.service";
import { useMutation } from "@tanstack/react-query";

export const useRestorePurchases = () => {
  const { showToast } = useToast();
  return useMutation({
    mutationFn: subscriptionService.restorePurchases,

    onSuccess: () => {
      showToast(`Your purchases have been restored`, "success");
    },

    onError: (err: any) => {
      showToast(err?.message || "Could not restore purchases", "error");
    },
  });
};
