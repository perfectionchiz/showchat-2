import { useToast } from "@/components/context/ToastContext";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export const useSurgeAlert = (roomId: string) => {
  const { showToast } = useToast();
  const { session } = useAuthStore();

  useEffect(() => {
    if (!roomId || !session?.access_token) return;

    supabase.realtime.setAuth(session.access_token);

    const channel = supabase
      .channel(`surge:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "room_join_counts",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const data = payload.new;

          if (data?.is_surge) {
            showToast(`${data.join_count} people just joined!`, "info", 2000);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, session?.access_token]);
};
