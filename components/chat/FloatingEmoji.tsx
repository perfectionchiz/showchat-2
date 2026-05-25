import { PRIMARY_COLOR } from "@/constants/constants";
import { User } from "@/models/auth.model";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface FloatingEmojiProps {
  emoji: string;
  user: User | null;
  isMe: boolean;
  onEnd: () => void;
}

export const FloatingEmoji = ({
  emoji,
  user,
  isMe,
  onEnd,
}: FloatingEmojiProps) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.9);

  useEffect(() => {

    translateY.value = withTiming(-SCREEN_HEIGHT + 140, {
      duration: 4200,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withDelay(
      3000,
      withTiming(
        0,
        {
          duration: 1200,
          easing: Easing.linear,
        },
        (finished) => {
          if (finished) {
            runOnJS(onEnd)();
          }
        },
      ),
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, {
          duration: 900,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0.96, {
          duration: 900,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const userLabel = isMe
    ? "Me"
    : user?.display_name?.charAt(0)?.toUpperCase() || "?";

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.emoji}>{emoji}</Text>

      <View style={[styles.badge, isMe && styles.myBadge]}>
        <Text style={styles.badgeText}>{userLabel}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 110,
    right: 24,
    alignItems: "center",
  },

  emoji: {
    fontSize: 42,
  },

  badge: {
    marginTop: -2,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },

  myBadge: {
    backgroundColor: PRIMARY_COLOR,
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
});
