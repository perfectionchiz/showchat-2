import { useToast } from "@/components/context/ToastContext";
import { LogoutReQuest } from "@/models/auth.model";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

export function useLogout() {
  const { showToast } = useToast();
  const clearAll = useAuthStore((state) => state.clearAll);

  return useMutation({
    mutationFn: (scope: LogoutReQuest) => authService.logout(scope),

    onSuccess: (_, variables) => {
      showToast(
        variables.scope === "global"
          ? "Logged out from all devices"
          : "Logged out successfully",
        "success",
      );
      clearAll();
      router.replace("/sign-in");
    },

    onError: (err) => {
      showToast(err.message || "Logout failed", "error");
    },
  });
}
