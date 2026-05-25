import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Text } from "../ui/Text";

export const AnimatedFans: React.FC<{ count?: string }> = ({
  count = "2,400+",
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{ opacity }}
      className="flex-row gap-1 items-center ml-auto"
    >
      <Text variant="semibold" className="text-white text-center">
        {count}
      </Text>
      <Text variant="medium" className="text-muted-foreground">
        fans chatting right now
      </Text>
    </Animated.View>
  );
};
