import { useShowProgress } from "@/hooks/use-show-progress";
import React from "react";
import { View } from "react-native";

interface ShowProgressBarProps {
  startsAt?: string;
  endsAt?: string;
  style?: object;
  step?: number;
}

export function ShowProgressBar({
  startsAt,
  endsAt,
  style,
  step,
}: ShowProgressBarProps) {
  const progress = useShowProgress(startsAt || "", endsAt || "");
  const stepProgress = step;
  return (
    <View
      className="w-full h-1 bg-gray-300 rounded-full overflow-hidden"
      style={style}
    >
      <View
        className="h-full rounded-full"
        style={{
          width: step ? `${stepProgress || 0}%` : `${progress}%`,
          backgroundColor: !step
            ? progress > 80
              ? "#f97316"
              : "#3b82f6"
            : "#f44034",
        }}
      />
    </View>
  );
}
