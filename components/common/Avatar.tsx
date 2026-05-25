import { cn } from "@/utils/helper";
import React from "react";
import { Image, View } from "react-native";
import { Text } from "../ui/Text";

const getColorFromName = (name?: string): string => {
  if (!name) return "bg-gray-600";

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-fuchsia-500",
    "bg-pink-500",
    "bg-rose-500",
  ];

  return colors[Math.abs(hash) % colors.length];
};

const getTextColor = (bgClass: string): string => {
  if (
    bgClass.includes("gray") ||
    bgClass.includes("yellow") ||
    bgClass.includes("amber") ||
    bgClass.includes("lime") ||
    bgClass.includes("orange")
  ) {
    return "text-gray-900";
  }
  return "text-white";
};

interface AvatarProps {
  name?: string;
  emoji?: string;
  uri?: string;
  size?: number;
  status?: "online" | "offline" | "away" | null;
  borderColor?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  emoji,
  uri,
  size = 48,
  status = null,
  borderColor = "border-background",
  className = "",
}) => {
  const displayText =
    emoji ||
    (name
      ? name
          .trim()
          .split(/\s+/)
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "?");

  const bgColor = getColorFromName(emoji || name);
  const textColor = getTextColor(bgColor);

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-500",
    away: "bg-yellow-500",
  };

  const hasStatus = !!status && status !== "offline";

  return (
    <View className={cn("relative shrink-0", className)}>
      {uri ? (
        <Image
          source={{ uri }}
          className={cn("rounded-full border-2", borderColor)}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      ) : (
        <View
          className={cn(
            "rounded-full border-2 justify-center items-center overflow-hidden",
            bgColor,
            borderColor,
          )}
          style={{ width: size, height: size }}
        >
          <Text
            variant="bold"
            className={cn(textColor)}
            style={{ fontSize: size * 0.42 }}
          >
            {displayText}
          </Text>
        </View>
      )}

      {hasStatus && (
        <View
          className={cn(
            "absolute border-2 border-gray-900 rounded-full",
            statusColors[status as keyof typeof statusColors],
          )}
          style={{
            width: size * 0.28,
            height: size * 0.28,
            right: size * 0.05,
            bottom: size * 0.05,
          }}
        />
      )}
    </View>
  );
};
