import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { Badge } from "../common/BadgeComponent";
import { Text } from "../ui/Text";

export default function LiveHeader({ rooms }: { rooms: any[] }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.4,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View className="mb-6">
      <View className="flex-row   gap-3 mb-1">
        <View className="relative mt-3">
          <View className="w-4 h-4 flex-row justify-center items-center bg-red-500 rounded-full" />

          <Animated.View
            style={{
              position: "absolute",
              width: 14,
              height: 14,
              borderRadius: 999,
              backgroundColor: "#ef4444",
              transform: [{ scale }],
              opacity: 0.5,
            }}
          />
        </View>
        <View>
          <View className="flex-row items-center">
            <Text variant="bold" className="text-4xl text-white">
              Live Now
            </Text>
            <View style={{ marginLeft: 20 }}>
              <Badge variant="secondary">
                {rooms.length} {rooms.length === 1 ? "show" : "shows"}
              </Badge>
            </View>
          </View>

          <Text className="text-sm mt-1 text-muted-foreground">
            The #1 chat app for live TV
          </Text>
        </View>
      </View>
    </View>
  );
}
