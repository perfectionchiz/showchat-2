import React from "react";
import { View } from "react-native";
import FallbackImage from "../ui/FallbackImage";
import { Text } from "../ui/Text";
import { LiveBadge } from "./LiveBadge";

interface Props {
  avatarUrl?: string;
  title?: string;
  subtitle?: string;
  timeslot?: string;
  isLive?: boolean;
  size?: "sm" | "lg";
  right?: React.ReactNode;
  isGuide?: boolean;
}

export function LiveCardHeader({
  avatarUrl,
  title,
  subtitle,
  timeslot,
  isLive,
  size = "sm",
  right,
  isGuide,
}: Props) {
  const RANDOM_BG_COLORS = [
    "#ffffff",
    "#fef3c7",
    "#dbeafe",
    "#d1fae5",
    "#fce7f3",
    "#ede9fe",
    "#fefaf0",
  ];

  const randomBg =
    RANDOM_BG_COLORS[Math.floor(Math.random() * RANDOM_BG_COLORS.length)];

  return (
    <View className="flex-row mb-2.5">
      <FallbackImage
        uri={avatarUrl}
        style={{
          height: 55,
          width: 55,
          backgroundColor: randomBg,
        }}
        className="rounded-xl mr-3 p-2 bg-white"
      />

      <View>
        <View className="flex-row items-center gap-1">
          <Text
            className={`text-white ${size === "lg" ? "text-xl" : "text-lg"}`}
            variant="semibold"
          >
            {title}
          </Text>
          {isLive && <LiveBadge className="bg-secondary" />}
          {isGuide && !isLive ? (
            <View className="px-2 py-1 w-[80px] bg-gray-700 rounded-full mt-1">
              <Text className="text-yellow-400 text-center text-xs">
                Upcoming
              </Text>
            </View>
          ) : null}
        </View>

        {subtitle && <Text className="text-gray-300 mt-1">{subtitle}</Text>}

        {timeslot && (
          <Text variant="medium" className="text-muted-foreground text-sm mt-1">
            {timeslot}
          </Text>
        )}

        {right}
      </View>
    </View>
  );
}
