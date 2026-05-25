import { IconButton } from "@/components/common/IconButton";
import NotificationActionsModal from "@/components/ui/notification/NotificationActionModal";
import NotificationGroup from "@/components/ui/notification/NotificationGroup";
import NotificationSettingsModal from "@/components/ui/notification/NotificationSettingModal";
import { Text } from "@/components/ui/Text";
import { Bell, EllipsisIcon } from "lucide-react-native";
import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";

import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { useNotifications } from "@/hooks/notification/useNotification";
import { useNotificationActions } from "@/hooks/notification/useNotificationActions";
import { Notification } from "@/models/notifications";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotificationScreen() {
  const { data, isLoading } = useNotifications();

  const {
    markAsRead,
    deleteNotification,
    markAllAsRead,
    deleteAllNotifications,
    markAsUnread,
  } = useNotificationActions();

  const [selected, setSelected] = React.useState<Notification | null>(null);
  const [showActions, setShowActions] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);

  const notifications = useMemo(() => {
    return [
      ...(data?.notifications.today ?? []),
      ...(data?.notifications.earlier ?? []),
    ];
  }, [data]);

  const groupedNotifications = useMemo(() => {
    return notifications.reduce(
      (acc: Record<string, Notification[]>, notif) => {
        const key =
          new Date(notif.created_at).toDateString() ===
          new Date().toDateString()
            ? "Recent Activity"
            : "Past Activity";

        if (!acc[key]) acc[key] = [];
        acc[key].push(notif);

        return acc;
      },
      {},
    );
  }, [notifications]);

  const hasNotifications = notifications.length > 0;
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-background">
      <SettingsHeader
        back={() => router.replace("/home")}
        extraChild={
          <View>
            {hasNotifications && (
              <IconButton
                className="bg-primary rounded-full"
                onPress={() => setShowSettings(true)}
                icon={<EllipsisIcon size={24} color="#a1a1aa" />}
              />
            )}
          </View>
        }
      >
        Notifications
      </SettingsHeader>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4 pt-5"
      >
        {isLoading ? (
          <View className="gap-6">
            {["Today", "Earlier"].map((title) => (
              <NotificationGroup
                key={title}
                title={title}
                loading={true}
                notifications={[]}
                onLongPress={() => {}}
              />
            ))}
          </View>
        ) : hasNotifications ? (
          Object.keys(groupedNotifications).map((group) => (
            <NotificationGroup
              key={group}
              title={group}
              notifications={groupedNotifications[group]}
              onLongPress={(notif) => {
                setSelected(notif);
                setShowActions(true);
              }}
            />
          ))
        ) : (
          <View className="flex-1 justify-center items-center py-20">
            <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-6">
              <Bell size={40} color="#d4d4d8" />
            </View>

            <Text variant="bold" className="text-2xl text-white mb-2">
              No notifications yet
            </Text>

            <Text className="text-zinc-400 text-center px-10 text-base">
              When someone reacts, mentions you, or updates a room or channel,
              notifications will appear here.
            </Text>
          </View>
        )}
      </ScrollView>

      <NotificationActionsModal
        visible={showActions}
        notification={selected}
        onClose={() => setShowActions(false)}
        onMarkRead={(id) => markAsRead.mutate(id)}
        onMarkAsUnRead={(id) => markAsUnread.mutate(id)}
        onDelete={(id) => deleteNotification.mutate(id)}
      />

      <NotificationSettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        onClearAll={async () => await deleteAllNotifications.mutateAsync()}
        onMarkAllRead={async () => await markAllAsRead.mutateAsync()}
      />
    </View>
  );
}
