import { useCallback, useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

const ROTATE_INTERVAL = 8000;

export const useCarousel = (length: number) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const next = useCallback(() => {
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

    setIndex((i) => (i + 1) % (length || 1));
    setProgress(0);
  }, [length]);

  useEffect(() => {
    if (paused || length <= 1) return;

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + 100 / (ROTATE_INTERVAL / 50);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [paused, length, next]);

  return {
    index,
    setIndex,
    progress,
    setProgress,
    paused,
    setPaused,
    fadeAnim,
    next,
  };
};
