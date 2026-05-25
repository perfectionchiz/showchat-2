import { useToast } from "@/components/context/ToastContext";
import { authSessionService } from "@/services/auth.session.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAuthSessions = () => {
  return useQuery({
    queryKey: ["auth-sessions"],
    queryFn: authSessionService.getSessions,
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => authSessionService.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-sessions"] });
      showToast("Session terminated successfully", "success");
    },
    onError: (error: any) => {
      const message = error.message || "Failed to delete session";
      showToast(message, "error");
    },
  });
};
