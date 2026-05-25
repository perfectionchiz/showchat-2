import { cn } from "@/utils/helper";
import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { Text } from "./Text";

interface AnimatedEmojisProps {
  emojis: { emoji: string; count: number }[];
}

export const AnimatedEmojis: React.FC<AnimatedEmojisProps> = ({ emojis }) => {
  const scaleValues = useRef<Animated.Value[]>([]).current;

  if (scaleValues.length !== emojis.length) {
    scaleValues.splice(
      0,
      scaleValues.length,
      ...emojis.map(() => new Animated.Value(0)),
    );
  }

  useEffect(() => {
    const animations = scaleValues.map((scale) =>
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
    );

    Animated.stagger(60, animations).start();
  }, [emojis]);

  return (
    <View className="flex-row gap-x-0.5 items-center">
      <View className="flex-row gap-x-2 items-center">
        {emojis.slice(0, 3).map((item, i) => (
          <Animated.View
            key={`${item.emoji}-${i}`}
            style={{
              transform: [{ scale: scaleValues[i] || new Animated.Value(1) }],
            }}
            className={cn(i > 0 ? "-ml-2" : "")}
          >
            <Text className="text-xl">{item.emoji}</Text>
          </Animated.View>
        ))}
      </View>
      {emojis.length > 3 && (
        <View className="ml-1">
          <Text className="text-muted-foreground text-xs font-medium">
            +{emojis.length - 3}
          </Text>
        </View>
      )}
    </View>
  );
};
