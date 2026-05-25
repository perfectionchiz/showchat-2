import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Avatar } from "./Avatar";

interface AnimatedAvatarProps {
  uri: string;
  size?: number;
  className?: string;
}

export const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({
  uri,
  size = 24,
  className = "",
}) => {
  const scale = useRef(new Animated.Value(0.3)).current;
  const translateX = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    scale.setValue(0.3);
    translateX.setValue(-20);

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [uri]);

  return (
    <Animated.View
      style={{
        transform: [{ translateX }, { scale }],

        marginLeft: className.includes("-ml") ? -8 : 0,
      }}
    >
      <Avatar name={uri} size={size} />
    </Animated.View>
  );
};
