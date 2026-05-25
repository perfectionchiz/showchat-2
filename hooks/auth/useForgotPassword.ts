import { useToast } from "@/components/context/ToastContext";
import { ForgotPasswordRequest } from "@/models/auth.model";
import { authService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function useForgotPassword() {
  const { showToast } = useToast();
  const [isReset, setReset] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      authService.forgotPassword(data),
    onSuccess: (res) => {
      showToast(
        res.message || "Email verification link sent successfully",
        "success",
      );
      setReset(true);
    },
    onError(err) {
      const message = err.message || "Something went wrong";
      showToast(message, "error");
    },
  });

  return { mutation, isReset };
}
