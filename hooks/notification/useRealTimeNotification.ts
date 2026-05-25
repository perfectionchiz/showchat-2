import { useToast } from "@/components/context/ToastContext";
import { supabase } from "@/lib/supabase";
import { Notification, NotificationsResponse } from "@/models/notifications";
import { useAuthStore } from "@/store/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useRealtimeNotifications = (userId?: string) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { session } = useAuthStore();

  useEffect(() => {
    if (!userId) {
      return;
    }

    if (!session?.access_token) {
      return;
    }

    supabase.realtime.setAuth(session.access_token);

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const eventType = payload.eventType;

          queryClient.setQueryData<NotificationsResponse>(
            ["notifications"],
            (old) => {
              if (!old) {
                return old;
              }

              const all = [
                ...old.notifications.today,
                ...old.notifications.earlier,
              ];
              if (eventType === "INSERT") {
                const newNotif = payload.new as Notification;

                if (all.some((n) => n.id === newNotif.id)) return old;

                return {
                  ...old,
                  notifications: {
                    today: [newNotif, ...old.notifications.today],
                    earlier: old.notifications.earlier,
                  },
                };
              }

              if (eventType === "UPDATE") {
                const updated = payload.new as Notification;
                const mapList = (list: Notification[]) =>
                  list.map((n) => (n.id === updated.id ? updated : n));

                return {
                  ...old,
                  notifications: {
                    today: mapList(old.notifications.today),
                    earlier: mapList(old.notifications.earlier),
                  },
                };
              }

              if (eventType === "DELETE") {
                const deleted = payload.old as Notification;

                const filterList = (list: Notification[]) =>
                  list.filter((n) => n.id !== deleted.id);

                return {
                  ...old,
                  notifications: {
                    today: filterList(old.notifications.today),
                    earlier: filterList(old.notifications.earlier),
                  },
                };
              }

              return old;
            },
          );
          queryClient.invalidateQueries({
            queryKey: ["notifications", "unread-count"],
          });

          if (eventType === "INSERT") {
            const newNotif = payload.new as Notification;

            showToast(`${newNotif.title}: ${newNotif.message}`, "info");
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, session?.access_token]);
};
