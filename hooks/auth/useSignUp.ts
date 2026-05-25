import { useToast } from "@/components/context/ToastContext";
import { SignUpRequest } from "@/models/auth.model";
import { authService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

export function useSignUp() {
  const { showToast } = useToast();
  return useMutation({
    mutationFn: (data: SignUpRequest) => authService.signUp(data),
    onSuccess: (userData) => {
      router.push("/verify-email");
      showToast(
        userData.message === "Success"
          ? "🎉 Registration successful! Check your inbox to verify your email and get started."
          : userData.message,
        "success",
      );
    },
    onError(err) {
      const message = err.message || "Something went wrong";
      showToast(message, "error");
    },
  });
}
