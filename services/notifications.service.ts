import { http } from "@/lib/httpHelper";
import { Notification, NotificationsResponse } from "@/models/notifications";

export const notificationService = {
  getNotifications: () => {
    return http.get<NotificationsResponse>("/notifications");
  },

  getNotification: (id: string) => {
    return http.get<Notification>(`/notifications?id=${id}`);
  },

  getUnreadNotifications: (id: string) => {
    return http.get<NotificationsResponse>(`/notifications-unread?id=${id}`);
  },
  getAllUnreadNotifications: (params?: { unread?: boolean }) => {
    return http.get<NotificationsResponse>(`/notifications`, params);
  },
  markAsRead: (id: string) => {
    return http.patch(`/notification-read?id=${id}`);
  },
  markAsUnRead: (id: string) => {
    return http.patch(`/notification-unread?id=${id}`);
  },
  markAllAsRead: () => {
    return http.post("/notifications-read-all");
  },

  deleteNotification: (id: string) => {
    return http.delete(`/notification-delete?id=${id}`);
  },

  deleteAllNotifications: () => {
    return http.delete("/notifications-delete-all");
  },
  updatePreferences: (data: {
    opt_in_notifications?: boolean;
    silent_mode_default?: boolean;
    preferred_categories?: string[] | null;
  }) => {
    return http.post("/user-preferences", data);
  },
};
