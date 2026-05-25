import { useToast } from "@/components/context/ToastContext";
import { NotificationsResponse } from "@/models/notifications";
import { notificationService } from "@/services/notifications.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useNotificationActions = (showpopUp: boolean = true) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const queryKey = ["notifications"];

  const updateSingleNotification = (id: string, updater: (n: any) => any) => {
    queryClient.setQueryData<NotificationsResponse>(queryKey, (old) => {
      if (!old) return old;

      const updateList = (list: any[]) =>
        list.map((n) => (n.id === id ? updater(n) : n));

      return {
        ...old,
        notifications: {
          today: updateList(old.notifications.today),
          earlier: updateList(old.notifications.earlier),
        },
      };
    });
  };

  const removeFromCache = (id: string) => {
    queryClient.setQueryData<NotificationsResponse>(queryKey, (old) => {
      if (!old) return old;

      const filterList = (list: any[]) => list.filter((n) => n.id !== id);

      return {
        ...old,
        notifications: {
          today: filterList(old.notifications.today),
          earlier: filterList(old.notifications.earlier),
        },
      };
    });
  };

  const markAsRead = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData(queryKey);

      updateSingleNotification(id, (n) => ({
        ...n,
        read: true,
      }));

      return { previous };
    },

    onSuccess: () => {
      showToast("Marked as read", "success");
    },

    onError: (_err, _id, context) => {
      showToast("Failed to update notification", "error");

      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
  });

  const markAsUnread = useMutation({
    mutationFn: (id: string) => notificationService.markAsUnRead(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData(queryKey);

      updateSingleNotification(id, (n) => ({
        ...n,
        read: false,
      }));

      return { previous };
    },

    onSuccess: () => {
      showToast("Marked as unread", "success");
    },

    onError: (_err, _id, context) => {
      showToast("Failed to update notification", "error");

      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: notificationService.markAllAsRead,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousData = queryClient.getQueryData(["notifications"]);
      queryClient.setQueryData(["notifications"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          notifications: {
            today:
              old.notifications?.today?.map((n: any) => ({
                ...n,
                read: true,
              })) || [],
            earlier:
              old.notifications?.earlier?.map((n: any) => ({
                ...n,
                read: true,
              })) || [],
          },
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      if (showpopUp) {
        showToast("Marked all as read successfully", "success");
      }
    },
    onError: (err, newState, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["notifications"], context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const deleteNotification = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData(queryKey);

      removeFromCache(id);

      return { previous };
    },

    onSuccess: () => {
      showToast("Notification deleted", "success");
    },

    onError: (_err, _id, context) => {
      showToast("Failed to delete notification", "error");

      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
  });

  const deleteAllNotifications = useMutation({
    mutationFn: notificationService.deleteAllNotifications,

    onSuccess: () => {
      showToast("All notifications cleared", "success");
      queryClient.invalidateQueries({ queryKey });
    },

    onError: () => {
      showToast("Failed to clear notifications", "error");
    },
  });

  return {
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  };
};
