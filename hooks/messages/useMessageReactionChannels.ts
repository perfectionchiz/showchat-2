import { queryClient } from "@/lib/queryClient";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export const useMessageReactionsChannel = (
  room_id: string,
  room_type: string,
  user: any,
) => {
  const { session } = useAuthStore();

  useEffect(() => {
    if (!room_id || !user?.id) return;

    const queryKey = ["messages", room_id, room_type];

    if (session?.access_token) {
      supabase.realtime.setAuth(session.access_token);
    }

    const channel = supabase
      .channel(`message-reactions-${room_id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message_reactions",
          filter: `room_id=eq.${room_id}`,
        },
        (payload: any) => {
          const { eventType, new: newRec, old: oldRec } = payload;
          const messageId = newRec?.message_id || oldRec?.message_id;

          queryClient.setQueryData(queryKey, (old: any) => {
            if (!old?.pages) return old;

            return {
              ...old,
              pages: old.pages.map((page: any) => ({
                ...page,
                messages: page.messages.map((msg: any) => {
                  if (msg.id !== messageId) return msg;

                  let reactions = Array.isArray(msg.reactions)
                    ? [...msg.reactions]
                    : [];

                  const applySingleUserRule = (
                    userId: string,
                    emoji?: string,
                  ) => {
                    reactions = reactions
                      .map((r) => {
                        const userIds = (r.user_ids || []).filter(
                          (id: string) => id !== userId,
                        );

                        return {
                          ...r,
                          user_ids: userIds,
                          count: userIds.length,
                        };
                      })
                      .filter((r) => r.user_ids.length > 0);
                    if (!emoji) return;

                    const idx = reactions.findIndex((r) => r.emoji === emoji);

                    if (idx === -1) {
                      reactions.push({
                        emoji,
                        user_ids: [userId],
                        count: 1,
                      });
                    } else {
                      reactions[idx] = {
                        ...reactions[idx],
                        user_ids: [
                          ...new Set([
                            ...(reactions[idx].user_ids || []),
                            userId,
                          ]),
                        ],
                        count: reactions[idx].user_ids.length + 1,
                      };
                    }
                  };

                  if (eventType === "INSERT") {
                    applySingleUserRule(newRec.user_id, newRec.emoji);
                  }

                  if (eventType === "DELETE") {
                    applySingleUserRule(oldRec.user_id);
                  }

                  if (eventType === "UPDATE") {
                    applySingleUserRule(oldRec.user_id);
                    applySingleUserRule(newRec.user_id, newRec.emoji);
                  }

                  return {
                    ...msg,
                    reactions,
                  };
                }),
              })),
            };
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room_id, room_type, user?.id, session?.access_token]);
};
