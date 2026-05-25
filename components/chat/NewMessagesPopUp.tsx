import dayjs from "dayjs";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { Text } from "../ui/Text";

type NewMessagesPopupProps = {
  count: number;
  firstTimestamp: string | Date | null;
  onPress: () => void;
};

export const NewMessagesPopup = ({
  count,
  firstTimestamp,
  onPress,
}: NewMessagesPopupProps) => {
  if (count === 0) return null;

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(15)}
      exiting={FadeOutDown.duration(200)}
      className="absolute left-0 right-0 top-0 z-50"
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        className="px-6 py-4  w-full bg-secondary shadow-lg"
      >
        <View className="flex-row justify-between">
          <View className="flex-row gap-1 items-center">
            <Text variant="bold" className="text-white text-sm">
              {count}
            </Text>
            <Text
              variant="semibold"
              className="text-white font-bold text-sm leading-tight"
            >
              {count > 1 ? "NEW MESSAGES" : "NEW MESSAGE"}
            </Text>
          </View>

          {firstTimestamp && (
            <Text className="text-white text-[9px] leading-tight">
              Since {dayjs(firstTimestamp).format("h:mm A")}
            </Text>
          )}
          <View className="">
            <Text variant="medium" className="text-sm">
              Jump to bottom ↓
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
