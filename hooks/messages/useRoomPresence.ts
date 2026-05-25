import { supabase } from "@/lib/supabase";
import { useShowStore } from "@/store/chatStore";
import { useEffect, useRef } from "react";

export const useRoomPresence = (
  roomId: string,
  user: any,
  enabled: boolean,
) => {
  const channelRef = useRef<any>(null);
  const userId = user?.id;

  useEffect(() => {
    if (!roomId || !userId || !enabled) return;
    if (channelRef.current) return;

    const channel = supabase.channel(`presence-${roomId}`, {
      config: {
        presence: { key: userId },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const newState = channel.presenceState();

        const users = Object.values(newState)
          .flat()
          .map((presence: any) => ({
            user_id: presence.user_id,
            display_name: presence.display_name,
            avatar_url: presence.avatar_url,
          }));

        useShowStore.getState().setPresenceUsers(users);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {})
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {})
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          const status = await channel.track({
            user_id: userId,
            display_name: user.display_name,
            avatar_url: user.profile_url,
            online_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [roomId, userId, enabled]);
};
