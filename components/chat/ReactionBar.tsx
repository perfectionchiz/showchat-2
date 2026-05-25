import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { FloatingEmoji } from "./FloatingEmoji";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ReactionBarProps {
  reactions?: string[];
  onReact?: (reaction: string) => void;
}

export const ReactionBar: React.FC<ReactionBarProps> = ({
  reactions = ["👍", "❤️", "😂", "😮", "😢", "👏"],
  onReact,
}) => {
  const [flyingEmojis, setFlyingEmojis] = useState<
    { id: number; emoji: string; startX: number; startY: number }[]
  >([]);

  const handlePress = (emoji: string) => {
    onReact?.(emoji);

    const newEmojis = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() + i,
      emoji,
      startX: Math.random() * (SCREEN_WIDTH - 40),
      startY: 0,
    }));

    setFlyingEmojis((prev) => [...prev, ...newEmojis]);
  };

  const removeFlyingEmoji = (id: number) => {
    setFlyingEmojis((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      {reactions.map((emoji) => (
        <TouchableOpacity
          key={emoji}
          onPress={() => handlePress(emoji)}
          activeOpacity={0.7}
        >
          <Text style={styles.emoji}>{emoji}</Text>
        </TouchableOpacity>
      ))}

      <View
        style={{
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
          top: 0,
          pointerEvents: "none",
        }}
      >
        {flyingEmojis.map((item) => (
          <FloatingEmoji
            key={item.id}
            emoji={item.emoji}
            startX={item.startX}
            startY={item.startY}
            onEnd={() => removeFlyingEmoji(item.id)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#1f2937",
    paddingVertical: 6,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    width: 300,
  },
  emoji: {
    fontSize: 28,
    marginHorizontal: 6,
  },
});
