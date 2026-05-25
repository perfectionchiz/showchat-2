import { useToast } from "@/components/context/ToastContext";
import { queryClient } from "@/lib/queryClient";
import { User } from "@/models/auth.model";
import { Message } from "@/models/message.model";
import { messageService } from "@/services/message.service";
import { isStickerMessage } from "@/utils/isStickerImage";
import { useMutation } from "@tanstack/react-query";

export const useSendMessage = (
  setMessage: (val: string) => void,
  user: User | null,
  onFirstMessage?: () => void,
) => {
  const { showToast } = useToast();
  const containsLink = (text: string) => /(https?:\/\/|www\.)\S+/i.test(text);

  const stripLinks = (text: string) =>
    text.replace(/(https?:\/\/|www\.)\S+/gi, "").trim();
  return useMutation({
    mutationFn: messageService.sendMessage,

    onMutate: async (vars) => {
      const queryKey = ["messages", vars.root_room_id, vars.room_type];

      const isSticker = isStickerMessage(vars.message);
      const hasLink = containsLink(vars.message);

      // ❌ BLOCK ONLY TEXT LINKS (ALLOW STICKERS)
      if (!isSticker && hasLink) {
        throw new Error("LINK_NOT_ALLOWED");
      }

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);
      const tempId = `temp-${Date.now()}`;

      const optimisticMessage: Message = {
        id: tempId,
        user_id: user?.id || "",
        display_name: user?.display_name || "",
        message: vars.message,
        avatar_url: user?.avatar_url || "",
        gamification_level: user?.gamification?.level || 0,
        is_premium: user?.is_premium || false,
        status: "sending",
        is_pinned: false,
        created_at: new Date().toISOString(),
        reactions: {},
      };

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page: any, index: number) => {
            if (index !== 0) return page;

            return {
              ...page,
              messages: [optimisticMessage, ...(page.messages || [])],
            };
          }),
        };
      });

      if (!isSticker) {
        setMessage("");
      }

      return { previousData, tempId, isSticker };
    },

    onSuccess: (data: any, vars, context) => {
      const res = data?.data;
      if (res?.is_first_message && onFirstMessage) {
        onFirstMessage();
      }

      const queryKey = ["messages", vars.root_room_id, vars.room_type];
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: any, index: number) => {
            if (index !== 0) return page;
            return {
              ...page,
              messages: page.messages.map((msg: any) =>
                msg.id === context?.tempId
                  ? {
                      ...msg,
                      status: "published",
                      id: res.message_id,
                      avatar_url: res.avatar_url,
                      is_premium: res?.is_premium || false,
                      gamification_level: res?.gamification_level,
                      server_id: res.message_id,
                    }
                  : msg,
              ),
            };
          }),
        };
      });
    },

    onError: (err: any, vars, context) => {
      const queryKey = ["messages", vars.root_room_id, vars.room_type];
      if (!context?.isSticker) {
        setMessage("");
      }

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: any, index: number) => {
            if (index !== 0) return page;
            return {
              ...page,
              messages: page.messages.map((msg: any) =>
                msg.id === context?.tempId ? { ...msg, status: "failed" } : msg,
              ),
            };
          }),
        };
      });

      showToast(err.message ?? "Failed to send message", "error");
    },
  });
};
