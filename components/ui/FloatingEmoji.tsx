import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { height } = Dimensions.get("window");

const EMOJIS = ["🔥", "❤️", "😂", "😱", "🎉", "💯", "👀", "⚡"];

interface BubbleProps {
  emoji: string;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

function Bubble({ emoji, x, delay, duration, size }: BubbleProps) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-height - 100, {
          duration,
          easing: Easing.out(Easing.ease),
        }),
        -1,
        false,
      ),
    );

    opacity.value = withDelay(
      delay,
      withRepeat(withTiming(0.35, { duration: duration / 3 }), -1, true),
    );

    rotate.value = withDelay(
      delay,
      withRepeat(withTiming(20, { duration: duration / 2 }), -1, true),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          left: `${x}%`,
          bottom: -30,
        },
        animatedStyle,
      ]}
    >
      <Text style={{ fontSize: size }}>{emoji}</Text>
    </Animated.View>
  );
}

export function FloatingEmojis({ count = 12 }: { count?: number }) {
  const bubbles = Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    x: Math.random() * 100,
    delay: Math.random() * 8000,
    duration: 6000 + Math.random() * 6000,
    size: 16 + Math.random() * 16,
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {bubbles.map((b) => (
        <Bubble key={b.id} {...b} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: "absolute",
  },
});
