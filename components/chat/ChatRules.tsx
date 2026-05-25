import { Info, X } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp, FadeOutUp, Layout } from "react-native-reanimated";
import { Text } from "../ui/Text";

type Props = {
  roomType: "live" | "show" | "private";
};

export function ChatRules({ roomType }: Props) {
  const [isVisible, setIsVisible] = useState(true);

  const rulesMap = {
    live: `No hate or spam. Keep chats fast and respectful.`,
    show: `No spoilers. Stay on topic and respect others.`,
    private: `Be respectful. Keep conversations appropriate.`,
  };

  if (!isVisible) return null;

  return (
    <Animated.View
      entering={FadeInUp.duration(400)}
      exiting={FadeOutUp.duration(300)}
      layout={Layout.springify().damping(15)}
      className="px-4 py-2 overflow-hidden"
    >
      <View className="flex-row items-start bg-primary p-3 rounded-2xl border border-gray-800 shadow-sm">
        <View className="bg-indigo-500/20 p-1.5 rounded-xl mr-3">
          <Info size={14} color="#818cf8" />
        </View>

        <View className="flex-1 justify-center pt-0.5">
          <Text className="text-muted-foreground text-[13px] leading-4 tracking-tight">
            <Text variant="semibold" className="text-gray-300">
              Rules •{" "}
            </Text>
            {rulesMap[roomType]}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setIsVisible(false)}
          activeOpacity={0.7}
          hitSlop={15}
          className="ml-2 bg-black/20 rounded-full p-1 border border-white/5"
        >
          <X size={12} color="#94a3b8" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
