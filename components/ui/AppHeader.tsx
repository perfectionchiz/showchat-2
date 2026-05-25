import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { User } from "@/models/auth.model";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { IconButton } from "../common/IconButton";
import Logo from "./Logo";
import { Text } from "./Text";

interface AppHeaderProps {
  profile?: User | null;
  onProfilePress?: () => void;
  badge: string | number;
  isLoggedIn: boolean;
  markAllAsRead?: () => void;
}

export function AppHeader({
  profile,
  onProfilePress,
  badge,
  isLoggedIn,
  markAllAsRead,
}: AppHeaderProps) {
  const handlePress = () => {
    if (onProfilePress) return onProfilePress();
  };
  const displayBadge = typeof badge === "number" && badge > 9 ? "9+" : badge;
  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: "#0b1220" }}>
      <View className="flex-row px-6 py-4 justify-between border-b border-gray-800">
        <Logo fontClassName="text-[23px]" iconSize={20} size={32} />
        {isLoggedIn && (
          <View className="flex-row items-center gap-4">
            <View className="relative">
              {badge !== 0 && (
                <View
                  style={{
                    position: "absolute",
                    right: 6,
                    top: 4,
                    backgroundColor: "#f44034",
                    minWidth: 16,
                    height: 16,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 3,
                    borderWidth: 2,
                    zIndex: 30,
                    borderColor: "#0b1220",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 8,
                      textAlign: "center",
                      lineHeight: 12,
                    }}
                    variant="bold"
                  >
                    {displayBadge}
                  </Text>
                </View>
              )}
              <IconButton
                onPress={() => {
                  markAllAsRead?.();
                  router.replace("/notifications");
                }}
                icon={
                  <Ionicons
                    color={"#C7CCD6"}
                    name={"notifications"}
                    size={24}
                  />
                }
              />
            </View>

            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.9}
                style={
                  Platform.OS !== "web" && {
                    shadowColor: "#eab308",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  }
                }
              >
                <View className=" rounded-full bg-white border border-yellow-200">
                  <Image
                    source={
                      profile?.avatar_url
                        ? { uri: profile.avatar_url }
                        : require("../../assets/images/avatar.jpg")
                    }
                    className=" rounded-full"
                    style={{ width: 40, height: 40, borderRadius: 999 }}
                  />
                </View>
              </TouchableOpacity>
              <View
                className="bg-green-500"
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 8,
                  backgroundColor: "#3B82F6",
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                }}
              />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
