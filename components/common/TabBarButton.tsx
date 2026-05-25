import { icons } from "@/assets/icons/icons";
import React, { useEffect, useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Text } from "../ui/Text";

type TabBarButtonProps = {
  isFocused: boolean;
  label: string;
  routeName: keyof typeof icons;
  color: string;
  onPress: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
  badge?: string | number;
};

const TabBarButton: React.FC<TabBarButtonProps> = ({
  isFocused,
  label,
  routeName,
  color,
  onPress,
  onLongPress,
  style,
  badge,
}) => {
  const focusScale = useSharedValue(isFocused ? 1 : 0);
  const pressScale = useSharedValue(1);
  const bgOpacity = useSharedValue(isFocused ? 1 : 0);

  const IconComponent = useMemo(() => icons[routeName], [routeName]);

  useEffect(() => {
    focusScale.value = withTiming(isFocused ? 1 : 0, { duration: 150 });
    bgOpacity.value = withTiming(isFocused ? 1 : 0, { duration: 150 });
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: (1 + 0.08 * focusScale.value) * pressScale.value,
        },
      ],
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => {
        pressScale.value = withSpring(0.92, {
          damping: 15,
          stiffness: 200,
        });
      }}
      onPressOut={() => {
        pressScale.value = withSpring(1, {
          damping: 15,
          stiffness: 200,
        });
      }}
      style={[styles.container, style]}
    >
      <View>
        <Animated.View style={animatedIconStyle}>
          <IconComponent active={isFocused} color={color} />
        </Animated.View>
      </View>

      <Text variant="semibold" style={[styles.label as TextStyle, { color }]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
  },
  label: {
    fontSize: 10,
  },
  focusBg: {
    position: "absolute",
    width: 45,
    height: 35,
    borderRadius: 10,
    top: -6,
    backgroundColor: "rgba(244, 64, 52, 0.1)",
  },
});

export default React.memo(
  TabBarButton,
  (prev, next) =>
    prev.isFocused === next.isFocused &&
    prev.color === next.color &&
    prev.label === next.label &&
    prev.routeName === next.routeName &&
    prev.badge === next.badge,
);
