import { queryClient } from "@/lib/queryClient";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export const useLiveRoomsRealtime = (search?: string) => {
  const { session } = useAuthStore();

  useEffect(() => {
    if (!session?.access_token) {
      return;
    }

    supabase.realtime.setAuth(session.access_token);

    const channel = supabase
      .channel("live-rooms-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "live_rooms",
        },
        (payload) => {
          queryClient.invalidateQueries({
            queryKey: ["live-rooms", search],
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [search, session?.access_token]);
};
