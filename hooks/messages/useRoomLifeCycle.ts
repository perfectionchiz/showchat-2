import { supabase } from "@/lib/supabase";
import { useShowStore } from "@/store/chatStore";
import { useEffect, useRef } from "react";

type RoomStatus = "LIVE" | "GRACE" | "CLOSED";

export const useRoomLifecycle = (roomId: string, enabled: boolean) => {
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!roomId || !enabled) return;
    if (channelRef.current) return;

    const channel = supabase.channel(`room-state-${roomId}`);

    channel
      .on("broadcast", { event: "room_state" }, ({ payload }) => {
        const status = payload?.status as RoomStatus;

        useShowStore.getState().setRoomState(status);

        if (status === "CLOSED") {
          useShowStore.getState().clearShow();
        }
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [roomId, enabled]);
};
