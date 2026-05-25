import { LinearGradient } from "expo-linear-gradient";
import { Eye } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { Button } from "../common/Button";

interface WatchOnlyBannerProps {
  goToAuth: () => void;
}

export const WatchOnlyBanner: React.FC<WatchOnlyBannerProps> = ({
  goToAuth,
}) => {
  return (
    <LinearGradient
      colors={["#3b82f680", "#3b82f60d", "transparent"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="border-t border-gray-700 "
    >
      <View
        style={{ paddingBottom: 30, paddingTop: 20, paddingHorizontal: 20 }}
        className="flex-row items-center justify-between pb-12"
      >
        <View className="flex-row items-center gap-2">
          <Eye size={16} color="#3b82f6" />
          <Text className="text-gray-400 text-sm">
            view mode —{" "}
            <Text className="text-white">sign in to join the chat</Text>
          </Text>
        </View>
        <Button
          size="sm"
          onPress={goToAuth}
          className="bg-blue-600 px-4 py-1.5 rounded"
        >
          Sign In
        </Button>
      </View>
    </LinearGradient>
  );
};
