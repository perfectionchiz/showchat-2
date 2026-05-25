import { useToast } from "@/components/context/ToastContext";
import { ResetPasswordRequest } from "@/models/auth.model";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

export function useResetPassword(isChange: boolean = false) {
  const { showToast } = useToast();
  const { clearAll } = useAuthStore();
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    onSuccess: (res) => {
      showToast(
        isChange
          ? "Password changed successfully, kindly login"
          : res.message || "Password reset successful, kindly login",
        "success",
      );
      clearAll();
      router.replace("/sign-in");
    },
    onError(err) {
      const message = err.message || "Something went wrong";
      showToast(message, "error");
    },
  });
}
