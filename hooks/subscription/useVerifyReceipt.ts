import { useToast } from "@/components/context/ToastContext";
import { subscriptionService } from "@/services/subscription.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useVerifyReceipt = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionService.verifyReceipt,

    onSuccess: () => {
      showToast("Subscription activated 🎉", "success");
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },

    onError: (err) => {
      showToast(
        `Verification Failed, ${err.message || "Invalid receipt"}`,
        "error",
      );
    },
  });
};
