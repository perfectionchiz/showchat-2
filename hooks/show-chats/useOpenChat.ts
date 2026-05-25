import { useToast } from "@/components/context/ToastContext";
import { tmdbService } from "@/services/tmdb.service";
import { useShowStore } from "@/store/chatStore";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

export const useOpenChat = () => {
  const setShow = useShowStore((s) => s.setShow);
  const { showToast } = useToast();
  return useMutation({
    mutationFn: (payload: { tmdb_id: string; media_type: string }) =>
      tmdbService.openChat(payload),

    onSuccess: (res) => {
      const room = res?.room;
      setShow(room);
      router.push({
        pathname: "/chats/[roomId]",
        params: {
          roomId: room.id,
          tmdb_id: room.tmdb_id,
          media_type: room?.show_type,
        },
      });
    },

    onError: (err) => {
      showToast(err.message || "openChat failed", "error");
    },
  });
};
