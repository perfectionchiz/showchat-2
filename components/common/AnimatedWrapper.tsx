import React, { ReactNode, useEffect, useRef } from "react";
import { Animated } from "react-native";

interface AnimatedWrapperProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  style?: object;
}

export const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  delay = 300,
  duration = 600,
  style = {},
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale, delay, duration]);

  return (
    <Animated.View style={[{ opacity, transform: [{ scale }] }, style]}>
      {children}
    </Animated.View>
  );
};
