import { useToast } from "@/components/context/ToastContext";
import { LoginRequest } from "@/models/auth.model";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";

export function useSignIn() {
  const { showToast } = useToast();

  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),

    onSuccess: (res: any, vars) => {
      setSession({
        access_token: res.access_token,
        refresh_token: res.refresh_token,
        expires_at: res.expires_at,
      });
      showToast("Login Successful", "success");
    },

    onError: (err: any) => {
      const message = err.message || "Something went wrong";
      showToast(message, "error");
    },
  });
}
