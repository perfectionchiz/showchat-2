import React, { useEffect, useRef } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

interface Props {
  visible: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function SlideUp({ visible, children, style }: Props) {
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: visible ? 0 : 20,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  return (
    <Animated.View
      className={`overflow-hidden ${visible ? "mt-6" : "mt-0"} `}
      style={[
        {
          transform: [{ translateY }],
          opacity,

          minHeight: visible ? undefined : 0,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}
