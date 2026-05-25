import { LiveStream } from "@/models/livechat.model";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions } from "react-native";

const ROTATE_INTERVAL = 8000;

type Props = {
  data: LiveStream[];
  renderItem: (item: LiveStream, width: number) => React.ReactNode;
};

export default function RotatingRow({ data, renderItem }: Props) {
  const { width: SCREEN_WIDTH } = Dimensions.get("window");

  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const current = data?.[index];

  useEffect(() => {
    if (!data?.length) return;

    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      setIndex((i) => (i + 1) % data.length);
    }, ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [data?.length]);

  if (!current) return null;

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {renderItem(current, SCREEN_WIDTH)}
    </Animated.View>
  );
}
