import { queryClient } from "@/lib/queryClient";
import { supabase } from "@/lib/supabase";
import { User } from "@/models/auth.model";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export const useRealtimeMessages = (
  room_id: string,
  room_type: string,
  user: User | null,
) => {
  const { session } = useAuthStore();

  useEffect(() => {
    if (!room_id) return;

    const queryKey = ["messages", room_id, room_type];
    supabase.realtime.setAuth(session?.access_token);

    const channel = supabase
      .channel(`room-${room_id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${room_id}`,
        },
        (payload: any) => {
          const { eventType, new: newMsg } = payload;

          queryClient.setQueryData(queryKey, (oldData: any) => {
            if (!oldData?.pages) return oldData;

            if (eventType === "INSERT") {
              const isDuplicate = oldData.pages[0]?.messages?.some(
                (msg: any) =>
                  msg.id === newMsg.id ||
                  (msg.status === "sending" &&
                    msg.message === newMsg.message &&
                    msg.user_id === newMsg.user_id),
              );

              if (isDuplicate) return oldData;

              return {
                ...oldData,
                pages: [
                  {
                    ...oldData.pages[0],
                    messages: [
                      { ...newMsg, reactions: {} },
                      ...(oldData.pages[0]?.messages || []),
                    ],
                  },
                  ...oldData.pages.slice(1),
                ],
              };
            }

            if (eventType === "UPDATE") {
              if (newMsg?.status === "deleted") {
                return {
                  ...oldData,
                  pages: oldData.pages.map((page: any) => ({
                    ...page,
                    messages: page.messages.filter(
                      (msg: any) =>
                        msg.id !== newMsg.id &&
                        msg.server_id !== newMsg.id.toString(),
                    ),
                  })),
                };
              }

              return {
                ...oldData,
                pages: oldData.pages.map((page: any) => ({
                  ...page,
                  messages: page.messages.map((msg: any) => {
                    if (
                      msg.id !== newMsg?.id &&
                      msg.server_id !== newMsg?.id.toString()
                    ) {
                      return msg;
                    }

                    return {
                      ...msg,
                      ...newMsg,
                      reactions: msg.reactions || {},
                      status: "published",
                    };
                  }),
                })),
              };
            }

            return oldData;
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room_id, room_type, session?.access_token]);
};
