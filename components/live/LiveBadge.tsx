import { cn } from "@/utils/helper";
import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { Text } from "../ui/Text";

interface LiveBadgeProps {
  label?: string;
  blink?: boolean;
  dotOnly?: boolean;
  className?: string;
  dotClass?: string;
}

interface LiveBadgeProps {
  label?: string;
  blink?: boolean;
  dotOnly?: boolean;
  className?: string;
  dotClass?: string;
}

export function LiveBadge({
  label = "LIVE",
  blink = true,
  dotOnly = false,
  className = "bg-secondary",
  dotClass = "bg-white",
}: LiveBadgeProps) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!blink) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [blink]);

  if (dotOnly) {
    return (
      <Animated.View style={{ opacity }}>
        <View className={cn("rounded-2xl w-1.5 h-1.5", dotClass, className)} />
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ opacity }}>
      <View
        className={cn(
          "px-3 py-1 flex-row justify-center items-center rounded-xl",
          className,
        )}
      >
        <Text variant="semibold" className="text-white text-xs">
          {label}
        </Text>
      </View>
    </Animated.View>
  );
}
