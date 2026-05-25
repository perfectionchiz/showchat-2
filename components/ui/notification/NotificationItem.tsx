import { Text } from "@/components/ui/Text";
import { Notification } from "@/models/notifications";
import { formatTime } from "@/utils/formatTime";
import { getBadgeGem } from "@/utils/getBadgeGem";
import { Image } from "expo-image";
import { Sparkles } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { BadgeSprinkles } from "./BadgeSprinkles";
import { notificationIcons } from "./NotificationIcon";

type Props = {
  notification: Notification;
  onLongPress: (notification: Notification) => void;
};

export default function NotificationItem({ notification, onLongPress }: Props) {
  const isBadge = notification.type === "badge_earned";
  const Icon =
    notificationIcons[notification.type] ?? notificationIcons.trending_room;

  const isRead = notification.read;

  const metadata = notification.metadata || {};
  const entries = Object.entries(metadata).filter(
    ([_, v]) => v !== null && v !== undefined && v !== "",
  );

  const formatMetadataValue = (key: string, value: any) => {
    if (!value || value === "null") {
      // Return fallback for location or general nulls
      if (key.toLowerCase().includes("location")) return "Unknown Location";
      return "N/A";
    }

    const valStr = String(value);
    const isDateKey =
      key.toLowerCase().includes("date") || key.toLowerCase().includes("_at");
    const isIsoDate =
      typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value);

    if (isDateKey || isIsoDate) {
      try {
        return formatTime(valStr);
      } catch {
        return valStr;
      }
    }
    return valStr;
  };
  const renderMeta = () => {
    if (!entries.length) return null;
    const isBadge = notification.type === "badge_earned";
    const badgeName = metadata.badge_name;
    const badgeDesc = metadata.badge_description;

    if (isBadge && badgeName) {
      return (
        <View
          style={{
            borderColor: " rgb(245 158 11 / 0.2)",
            backgroundColor: "rgb(245 158 11 / 0.2)",
          }}
          className="mt-3 p-3 rounded-2xl bg-amber-500/10 border  flex-row items-center"
        >
          <View className="w-8 h-8  items-center justify-center">
            <Image
              style={{ height: "100%", width: "100%" }}
              source={getBadgeGem(badgeName)}
            />
          </View>
          <View className="flex-1">
            <Text variant="semibold" className="text-amber-400 text-sm">
              {badgeName}
            </Text>
            {badgeDesc && (
              <Text
                className={`text-[11px] ${notification.read ? "text-zinc-400" : "text-zinc-300"} mt-0.5`}
                numberOfLines={1}
              >
                {badgeDesc}
              </Text>
            )}
          </View>
          <Sparkles size={16} color="#fbbf24" opacity={0.6} />
        </View>
      );
    }

    const filteredEntries = entries.filter(([key]) => {
      const k = key.toLowerCase();
      const isInternal =
        k.includes("badge_") ||
        k.endsWith("_id") ||
        k === "id" ||
        k.includes("uuid") ||
        k.includes("token");
      return !isInternal;
    });
    if (filteredEntries.length === 0) return null;
    return (
      <View className="mt-3 pl-3 border-l border-white/10">
        {filteredEntries.slice(0, 3).map(([key, value]) => (
          <View key={key} className="mb-2">
            <Text className="text-[10px] uppercase tracking-widest text-zinc-500">
              {key.replace(/_/g, " ")}
            </Text>
            <Text
              className="text-[12px] text-zinc-300 mt-0.5"
              numberOfLines={2}
            >
              {formatMetadataValue(key, value)}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity
      onLongPress={() => onLongPress(notification)}
      activeOpacity={0.85}
      className="flex-row px-4 py-4 mb-3 rounded-xl"
      style={{
        backgroundColor: isRead ? "transparent" : "rgba(99,102,241,0.05)",
      }}
    >
      {isBadge && <BadgeSprinkles />}
      <View className="items-center mr-3">
        <View className="w-10 h-10 rounded-full bg-[#111827] items-center justify-center">
          <Icon size={18} color={isRead ? "#6b7280" : "#c7d2fe"} />
        </View>

        <View className="flex-1 w-[1px] bg-white/5 mt-2" />
      </View>

      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Text
            variant="semibold"
            numberOfLines={1}
            className={`text-[15px] flex-1 pr-2 ${
              isRead ? "text-zinc-400" : "text-white"
            }`}
          >
            {notification.title}
          </Text>

          <Text className="text-[10px] text-zinc-400">
            {formatTime(notification.created_at)}
          </Text>
        </View>

        <Text
          numberOfLines={2}
          className={`text-[13px] mt-1 leading-5 ${
            isRead ? "text-zinc-500" : "text-zinc-300"
          }`}
        >
          {notification.message}
        </Text>

        {renderMeta()}
      </View>

      {!isRead && (
        <View className="w-2 h-2 rounded-full bg-[#5865F2] ml-2 mt-2" />
      )}
    </TouchableOpacity>
  );
}
