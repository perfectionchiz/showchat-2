import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import FallbackImage from "./FallbackImage";
import { Text } from "./Text";

interface MockPosterCardProps {
  posterUrl?: string;
  title?: string;
  onPress?: () => void;
  width: number;
}

export function MockPosterCard({
  posterUrl,
  onPress,
  width,
  title,
}: MockPosterCardProps) {
  const aspectRatio = 2 / 3;
  const height = width / aspectRatio;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{ width, height }}
    >
      <View style={[styles.container, { width, height: 120 }]}>
        <FallbackImage
          style={styles.image}
          uri={posterUrl}
          className="p-2"
          resizeMode="cover"
        />
        <Text>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fallback: {
    flex: 1,
    backgroundColor: "#444",
  },
});
