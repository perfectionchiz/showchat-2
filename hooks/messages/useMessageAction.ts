import { useToast } from "@/components/context/ToastContext";
import { queryClient } from "@/lib/queryClient";
import { User } from "@/models/auth.model";
import { messageService } from "@/services/message.service";
import { updateMessagesCache } from "@/utils/updateMessageCache";
import { useMutation } from "@tanstack/react-query";

export const useMessageActions = (
  room_id: string,
  room_type: "live" | "show" | "private",
  user: User | null,
) => {
  const { showToast } = useToast();

  const pin = useMutation({
    mutationFn: messageService.pinMessage,

    onSuccess: (res: any, variables: any) => {
      showToast(res?.message || "message pinned", "info", 500);

      updateMessagesCache(room_id, room_type, (msg: any) => {
        if (msg.id !== variables.message_id) return msg;

        return {
          ...msg,
          is_pinned: !msg.is_pinned,
        };
      });
    },

    onError: (err) => {
      showToast(err.message || "an error occured", "error");
    },
  });

  const remove = useMutation({
    mutationFn: messageService.deleteMessage,

    onMutate: async (messageId) => {
      const queryKey = ["messages", room_id, room_type];

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            messages: page.messages.filter((m: any) => m.id !== messageId),
          })),
        };
      });

      return { previousData };
    },

    onError: (err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["messages", room_id, room_type],
          context.previousData,
        );
      }

      showToast(err.message || "an error occured", "error");
    },

    onSuccess: (res: any) => {
      showToast(res?.message || "message deleted", "info");
    },
  });

  const report = useMutation({
    mutationFn: messageService.reportMessage,

    onSuccess: (res: any, variables: any) => {
      updateMessagesCache(room_id, room_type, (msg: any) => {
        if (msg.id !== variables.message_id) return msg;

        return {
          ...msg,
          is_reported: true,
        };
      });

      showToast(res?.message || "report sent", "info");
    },

    onError: (err: any) => {
      showToast(err.message || "an error occured", "info");
    },
  });
  const react = useMutation({
    mutationFn: messageService.reactToMessage,

    onMutate: async ({ message_id, emoji }) => {
      const currentUserId = user?.id;
      if (!currentUserId) return;

      const queryKey = ["messages", room_id, room_type];
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            messages: page.messages.map((msg: any) => {
              if (msg.id !== message_id) return msg;

              const reactions = Array.isArray(msg.reactions)
                ? [...msg.reactions]
                : [];

              let updatedReactions = reactions
                .map((r) => {
                  const userIds = (r.user_ids || []).filter(
                    (id: string) => id !== currentUserId,
                  );

                  return {
                    ...r,
                    user_ids: userIds,
                    count: userIds.length,
                  };
                })
                .filter((r) => r.user_ids.length > 0);

              const existingIndex = updatedReactions.findIndex(
                (r) => r.emoji === emoji,
              );

              if (existingIndex > -1) {
                const r = updatedReactions[existingIndex];

                updatedReactions[existingIndex] = {
                  ...r,
                  user_ids: [...r.user_ids, currentUserId],
                  count: r.user_ids.length + 1,
                };
              } else {
                updatedReactions.push({
                  emoji,
                  user_ids: [currentUserId],
                  count: 1,
                });
              }

              return {
                ...msg,
                reactions: updatedReactions,
              };
            }),
          })),
        };
      });

      return { previousData };
    },

    onSuccess: (res: any, variables) => {
      const queryKey = ["messages", room_id, room_type];
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            messages: page.messages.map((msg: any) => {
              if (msg.id !== variables.message_id) return msg;
              return { ...msg, reactions: res.reactions || msg.reactions };
            }),
          })),
        };
      });
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["messages", room_id, room_type],
          context.previousData,
        );
      }
    },

    onSettled: () => {
      // Optional: refetch to ensure background sync
      // queryClient.invalidateQueries({ queryKey: ["messages", room_id, room_type] });
    },
  });
  return { pin, remove, report, react };
};
