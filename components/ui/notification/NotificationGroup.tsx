import { Text } from "@/components/ui/Text";
import { Notification } from "@/models/notifications";
import React from "react";
import { View } from "react-native";
import SkeletonText from "../skeleton/SkeletonText";
import NotificationItem from "./NotificationItem";

type Props = {
  title: string;
  notifications?: Notification[];
  loading?: boolean;
  onLongPress: (notification: Notification) => void;
};

export default function NotificationGroup({
  title,
  notifications = [],
  loading = false,
  onLongPress,
}: Props) {
  return (
    <View className="mb-6">
      <Text variant="semibold" className="text-zinc-300 text-sm px-1 mb-3">
        {title}
      </Text>

      {loading ? (
        <View className="gap-3 px-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <View key={i} className="flex-row gap-3 items-center">
              <SkeletonText width={40} height={40} />
              <View className="flex-1 gap-2">
                <SkeletonText width="60%" height={14} />
                <SkeletonText width="80%" height={12} />
              </View>
            </View>
          ))}
        </View>
      ) : (
        notifications.map((notif) => (
          <NotificationItem
            key={notif.id}
            notification={notif}
            onLongPress={onLongPress}
          />
        ))
      )}
    </View>
  );
}
