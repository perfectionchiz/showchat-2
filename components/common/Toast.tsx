import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "../ui/Text";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onHide?: () => void;
}

const { width } = Dimensions.get("window");
const TOAST_WIDTH = width * 0.9;

const Toast = ({
  visible,
  message,
  type = "info",
  duration = 3000,
  onHide,
}: ToastProps) => {
  const [mounted, setMounted] = useState(false);

  const translateY = useRef(new Animated.Value(-60)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(1)).current;
  const hideTimeout = useRef<NodeJS.Timeout | number | null>(null);
  const hideToast = useCallback(() => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -80,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMounted(false);
      onHide?.();
    });
  }, [onHide, opacity, translateY]);
  useEffect(() => {
    if (visible && message) {
      setMounted(true);
      opacity.setValue(0);
      translateY.setValue(-60);
      progress.setValue(1);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: duration,
          useNativeDriver: false,
        }),
      ]).start();

      hideTimeout.current = setTimeout(hideToast, duration);
    } else if (!visible) {
      hideToast();
    }
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, [visible, message, type, duration, hideToast]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 5,

      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < 0) {
          translateY.setValue(gestureState.dy);
          opacity.setValue(1 + gestureState.dy / 100);
        }
      },

      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -50) {
          hideToast();
        } else {
          Animated.parallel([
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  const getAccentColor = () => {
    switch (type) {
      case "success":
        return "#00FFC2";
      case "error":
        return "#FF4D4D";
      default:
        return "#00E5FF";
    }
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TOAST_WIDTH],
  });

  if (!mounted) return null;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.toastCard}>
        <View style={[styles.glow, { backgroundColor: getAccentColor() }]} />

        <View style={styles.content}>
          <View style={[styles.dot, { backgroundColor: getAccentColor() }]} />
          <Text style={styles.text} numberOfLines={2}>
            {message}
          </Text>
        </View>

        <View style={styles.loaderTrack}>
          <Animated.View
            style={[
              styles.loaderBar,
              {
                backgroundColor: getAccentColor(),
                width: progressWidth,
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 99999,
  },
  toastCard: {
    width: TOAST_WIDTH,
    backgroundColor: "#0A101F",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1E293B",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 12,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  glow: {
    position: "absolute",
    left: -30,
    top: -10,
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.12,
  },
  text: {
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "600",
  },
  loaderTrack: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  loaderBar: {
    height: "100%",
  },
});

export default Toast;
