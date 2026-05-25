import { useToast } from "@/components/context/ToastContext";
import { oAuthService } from "@/services/oAuthSignIn";
import { useMutation } from "@tanstack/react-query";

export const useOAuth = () => {
  const { showToast } = useToast();

  const googleMutation = useMutation({
    mutationFn: oAuthService.signInWithGoogle,

    onSuccess: (res) => {
      if (res?.success) {
        showToast("Login successful", "success");
      }
    },

    onError: (err: any) => {
      showToast(err?.message || "Login failed", "error");
    },
  });

  const appleMutation = useMutation({
    mutationFn: oAuthService.signInWithApple,

    onSuccess: (res) => {
      if (res?.success) {
        showToast("Login successful", "success");
      }
    },

    onError: (err: any) => {
      showToast(err?.message || "Login failed", "error");
    },
  });

  return {
    signInWithGoogle: googleMutation.mutate,
    signInWithApple: appleMutation.mutate,

    isGoogleLoading: googleMutation.isPending,
    isAppleLoading: appleMutation.isPending,
  };
};
