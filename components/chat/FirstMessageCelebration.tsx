import { PartyPopper, Sparkles } from "lucide-react-native";
import React, { useEffect } from "react";
import { Animated, Text, View } from "react-native";

interface FirstMessageCelebrationProps {
  show: boolean;
  onComplete: () => void;
}

export function FirstMessageCelebration({
  show,
  onComplete,
}: FirstMessageCelebrationProps) {
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (show) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(onComplete);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <View
      pointerEvents="none"
      className="absolute inset-0 z-50 justify-center items-center px-10"
    >
      <Animated.View
        style={{ opacity: opacityAnim }}
        className="absolute inset-0 bg-black/40"
      />

      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }}
        className="w-full"
      >
        <View
          className="rounded-[32px] p-8 overflow-hidden items-center"
          style={{
            backgroundColor: "#050912",
            shadowColor: "#eab308",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <View className="absolute top-5 left-4 opacity-40">
            <Sparkles color="#eab308" size={20} />
          </View>
          <View className="absolute top-5 right-4 opacity-40">
            <Sparkles color="#eab308" size={24} />
          </View>

          <View className="bg-yellow-500 p-4 rounded-full mb-5 shadow-lg shadow-yellow-500/50">
            <PartyPopper color="#fff" size={32} />
          </View>

          <Text className="text-white text-2xl font-black tracking-tighter text-center">
            Milestone Unlocked!
          </Text>

          <Text className="text-white font-bold uppercase text-[10px] tracking-[3px] mt-2 mb-4">
            First Message Sent
          </Text>

          <View className="h-[1px] w-12 bg-white/10 mb-4" />

          <Text className="text-gray-400 text-center text-sm leading-5 font-medium">
            Welcome to the community.{"\n"}Your journey starts here.
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
