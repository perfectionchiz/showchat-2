import React, { ReactNode, useEffect, useRef } from "react";
import { Animated, Platform, ViewStyle } from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface SafeAreaWrapperProps extends SafeAreaViewProps {
  children: ReactNode;
  paddingHorizontal?: number;
  extraBottom?: number;
  style?: ViewStyle;
}

export default function SafeAreaWrapper({
  children,
  paddingHorizontal = 0,
  extraBottom = Platform.OS === "ios" ? 16 : 70,
  style,
  ...props
}: SafeAreaWrapperProps) {
  const insets = useSafeAreaInsets();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView
      {...props}
      className="bg-background"
      style={[
        {
          flex: 1,
          paddingBottom: insets.bottom + extraBottom,
          paddingHorizontal,
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {children}
      </Animated.View>
    </SafeAreaView>
  );
}
