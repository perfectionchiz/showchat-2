import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { Text } from "../ui/Text";
import { TypingUser } from "./ChatMessages";

interface TypingUsersProps {
  typingUsers: TypingUser[];
  isTyping: boolean;
}

export const TypingUsers = ({
  typingUsers = [],
  isTyping,
}: TypingUsersProps) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const shouldShow = isTyping && typingUsers.length > 0;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: shouldShow ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [shouldShow]);

  return (
    <View style={{ height: 25, justifyContent: "center" }}>
      <Animated.View
        style={{
          opacity,
          paddingHorizontal: 16,
          pointerEvents: shouldShow ? "auto" : "none",
        }}
      >
        <Text className="text-gray-400 text-xs italic">
          {typingUsers.length === 1
            ? `${typingUsers[0]?.user_name || "Someone"} 👀 is typing...`
            : `${typingUsers.length} people are typing...`}
        </Text>
      </Animated.View>
    </View>
  );
};
