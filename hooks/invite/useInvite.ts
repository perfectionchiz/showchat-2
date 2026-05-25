import { useToast } from "@/components/context/ToastContext";
import { http } from "@/lib/httpHelper";
import { useMutation } from "@tanstack/react-query";
import { Share } from "react-native";

interface InviteResponse {
  message: string;
  success: boolean;
  status: number;
  inviteLink: string;
}

export const useInviteFriends = (setInviteLink?: (val: string) => void) => {
  const { showToast } = useToast();
  return useMutation({
    mutationFn: () => http.post<InviteResponse>("/invite"),
    onSuccess: (data) => {
      showToast(data.message || "Invite link sent", "success");

      if (data?.inviteLink) {
        setInviteLink?.(data.inviteLink);
        Share.share({
          message: `Join me on this app 🚀\n${data.inviteLink}`,
        });
      }
    },

    onError: (error) => {
      showToast(error.message || "Invite failed", "error");
    },
  });
};
