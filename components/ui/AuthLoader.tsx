import { PRIMARY_COLOR } from "@/constants/constants";
import React, { useEffect } from "react";
import { ActivityIndicator, Animated, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "./Text";

export const AuthLoadingScreen = () => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.4,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center items-center px-6">
        <View className="items-center">
          <View className="p-8 rounded-full bg-white/5 border mb-3 border-white/10">
            <ActivityIndicator color={PRIMARY_COLOR} size="large" />
          </View>

          <Animated.View
            style={{ opacity: fadeAnim }}
            className="items-center space-y-2"
          >
            <Text
              variant="bold"
              className="text-white text-xl tracking-widest uppercase"
            >
              Syncing Profile
            </Text>

            <Text className="text-gray-400 text-sm text-center max-w-xs">
              Preparing your secure environment...
            </Text>
          </Animated.View>
        </View>

        <View className="absolute bottom-10">
          <Text className="text-gray-600 text-xs tracking-widest uppercase">
            Secure Encryption Active
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
