import { formatISO } from "@/utils/formatTime";
import { getBadgeGem } from "@/utils/getBadgeGem";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

interface AchievementBadgeProps {
  name: string;
  description: string;
  isEarned: boolean;
  date?: string;
}

export const AchievementBadge = ({
  name,
  description,
  isEarned,
  date,
}: AchievementBadgeProps) => {
  return (
    <View
      className={`w-[48%] p-4 mb-4 rounded-3xl border ${
        isEarned
          ? "bg-white/10 border-white/20"
          : "bg-black/20 border-white/5 opacity-50"
      }`}
    >
      <View className="items-center">
        {isEarned && (
          <View className="absolute top-2 w-12 h-12 bg-blue-500/30 rounded-full blur-xl" />
        )}

        <Image
          source={getBadgeGem(name)}
          style={{ width: 60, height: 60, marginBottom: 12 }}
          contentFit="contain"
          className={!isEarned ? "grayscale" : ""}
        />

        <Text
          className="text-white font-bold text-center text-sm"
          numberOfLines={1}
        >
          {name}
        </Text>

        <Text
          className="text-gray-400 text-[10px] text-center mt-1 leading-3"
          numberOfLines={2}
        >
          {description}
        </Text>

        {isEarned && date && (
          <View className="mt-3 bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-500/30">
            <Text className="text-blue-300 text-[9px] font-bold">
              {formatISO(date)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
