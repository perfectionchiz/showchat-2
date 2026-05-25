import { getColorFromName } from "@/utils/getInitials";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, View } from "react-native";
import { Text } from "../ui/Text";

type AvatarProps = {
  profileUrl?: string;
  displayName: string;
  getInitials: (name: string) => string;
  size?: number;
  isPremium?: boolean;
};

export const UserAvatar: React.FC<AvatarProps> = ({
  profileUrl,
  displayName,
  getInitials,
  size = 48,
  isPremium = false,
}) => {
  const initials = getInitials(displayName);
  const nitroColors = ["#FF73FA", "#9B45FF", "#00D2FF"] as const;

  const borderWidth = Math.max(size * 0.06, 2.5);
  const gapWidth = Math.max(size * 0.04, 1.5);

  const AvatarCore = (
    <View
      className="rounded-full  overflow-hidden items-center justify-center"
      style={{
        width: isPremium ? size - (borderWidth + gapWidth) * 2 : size,
        height: isPremium ? size - (borderWidth + gapWidth) * 2 : size,
        backgroundColor: profileUrl ? "transparent" : "#1F2937",
      }}
    >
      {profileUrl ? (
        <Image
          source={{ uri: profileUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <Text
          variant="semibold"
          className=" text-white"
          style={{ fontSize: size / 2.5, color: getColorFromName(displayName) }}
        >
          {initials}
        </Text>
      )}
    </View>
  );

  if (!isPremium) return <View className="flex-shrink-0">{AvatarCore}</View>;

  return (
    <View className="flex-shrink-0" style={{ width: size, height: size }}>
      <View
        style={{
          position: "absolute",
          top: -size * 0.27,
          right: -size * 0.1,
          zIndex: 10,
          transform: [{ rotate: "15deg" }],
          shadowColor: "#FFD700",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Text style={{ fontSize: size * 0.4 }}>👑</Text>
      </View>

      <View
        className="items-center justify-center"
        style={{
          width: size,
          height: size,
          shadowColor: nitroColors[1],
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        <LinearGradient
          colors={nitroColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            padding: borderWidth,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              borderRadius: size / 2,
              backgroundColor: "#0b1220",
              alignItems: "center",
              justifyContent: "center",
              padding: gapWidth,
            }}
          >
            {AvatarCore}
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};
