import React from "react";
import { Text, View } from "react-native";

interface FirstMessageNudgeProps {
  show: boolean;
}

export function FirstMessageNudge({ show }: FirstMessageNudgeProps) {
  if (!show) return null;

  return (
    <View className="py-1.5 items-center">
      <Text className="text-xs text-gray-400 text-center">
        💬 Say hi — everyone&apos;s friendly here
      </Text>
    </View>
  );
}
