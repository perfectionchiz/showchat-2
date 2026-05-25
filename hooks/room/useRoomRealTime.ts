import { queryClient } from "@/lib/queryClient";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useRoomStore } from "@/store/roomStore";
import { useEffect } from "react";

export const useRoomRealtime = (
  roomId?: string,
  openChat: boolean = false,
  callBack?: () => void,
) => {
  const { session } = useAuthStore();
  const updateRoom = useRoomStore((s) => s.updateRoom);

  useEffect(() => {
    if (!session?.access_token || !roomId || !openChat) {
      return;
    }

    supabase.realtime.setAuth(session.access_token);

    const channelName = `room-${roomId}-${Date.now()}`;
    const channel = supabase.channel(channelName);

    channel.on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "chat_rooms",
        filter: `id=eq.${roomId}`,
      },
      (payload) => {
        const newRow = payload.new as any;
        if (newRow.room_status === "ended") {
          callBack?.();
        }
        updateRoom({
          vibe: newRow.vibe,
          isLive: newRow.room_status,
          viewers: newRow.user_count,
          messageCount: newRow.message_count_10min,
        });

        queryClient.setQueriesData({ queryKey: ["live-rooms"] }, (old: any) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: {
                ...page.data,
                also_live: page.data.also_live?.map((room: any) =>
                  room.id === roomId
                    ? {
                        ...room,
                        vibe: newRow.vibe,
                        room_status: newRow.room_status,
                        user_count: newRow.user_count,
                        message_count_10min: newRow.message_count_10min,
                      }
                    : room,
                ),
              },
            })),
          };
        });
      },
    );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, session?.access_token, openChat]);
};
