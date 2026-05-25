import { useToast } from "@/components/context/ToastContext";
import { useMutation } from "@tanstack/react-query";

export function useVerifyEmail() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (token?: string) => {
      if (!token) {
        throw new Error("Invalid or missing verification token");
      }
      return true;
    },

    onSuccess: () => {
      showToast("Email verified successfully 🎉", "success");
    },
    onError: (err: any) => {
      showToast(err?.message || "Verification failed", "error");
    },
  });
}
