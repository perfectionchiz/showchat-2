export type NotificationType =
  | "show_starting"
  | "friend_joined"
  | "trending_room"
  | "streak_reminder"
  | "private_room_member_joined"
  | "private_room_member_removed"
  | "private_room_deleted"
  | "private_room_message"
  | "subscription_activated"
  | "subscription_expired"
  | "subscription_cancelled"
  | "subscription_grace_period"
  | "new_login_device"
  | "system_maintenance"
  | "your_friend_joined"
  | "password_changed"
  | "welcome_to_showchats"
  | "feature_update"
  | "welcome"
  | "show_level_up"
  | "badge_earned"
  | "account_update"
  | "security_alert";

export type Notification = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  metadata: any;
  created_at: string;
};

export type NotificationsGrouped = {
  today: Notification[];
  earlier: Notification[];
};

export type NotificationsResponse = {
  message: string;
  success: boolean;
  status: number;
  notifications: NotificationsGrouped;
};
