import { Heart } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import FallbackImage from "../ui/FallbackImage";
import { Text } from "../ui/Text";

interface ShowItem {
  id: string;
  title: string;
  posterUrl?: string;
}

interface ShowCardProps {
  item: ShowItem;
  index: number;
  totalItems: number;
  numColumns: number;
  screenWidth: number;
  imageWidth: number;
  imageHeight: number;
  imageMargin: number;
  followedShows: string[];
  toggleFollow: (id: string) => void;
  truncate: (text: string, length: number) => string;
}

export function ShowCard({
  item,
  index,
  totalItems,
  numColumns,
  screenWidth,
  imageWidth,
  imageHeight,
  imageMargin,
  followedShows,
  toggleFollow,
  truncate,
}: ShowCardProps) {
  const PLACEHOLDER_IMAGE = require("../../assets/images/placeholder.jpg");

  const isFollowed = followedShows.includes(item.id);

  const heartScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isFollowed) {
      Animated.sequence([
        Animated.spring(heartScale, {
          toValue: 1.35,
          friction: 3.5,
          tension: 40,
          useNativeDriver: true,
        }),
       
        Animated.spring(heartScale, {
          toValue: 1,
          friction: 4,
          tension: 35,
          useNativeDriver: true,
        }),
      ]).start();
    }
 
  }, [isFollowed]);

  const itemsLeft = totalItems - index;
  const isLastRow =
    Math.ceil(totalItems / numColumns) ===
    Math.ceil((index + 1) / numColumns);

  const itemsInLastRow = totalItems % numColumns || numColumns;

  const multipliers: Record<number, number> = {
    1: 4,
    2: 2.3,
    3: 1,
  };

  const multiplier = multipliers[itemsInLastRow] ?? 2.3;

  const currentWidth =
    isLastRow && itemsLeft <= numColumns
      ? (screenWidth - imageMargin * (itemsInLastRow * multiplier)) /
        itemsInLastRow
      : imageWidth;

  const isLastInRow = (index + 1) % numColumns === 0;

  return (
    <TouchableOpacity
      onPress={() => toggleFollow(item.id)}
      activeOpacity={0.8}
      style={{
        width: currentWidth,
        marginRight: !isLastInRow ? imageMargin : 0,
        marginBottom: imageMargin,
      }}
    >
      <View className="relative">
        <FallbackImage
          uri={item.posterUrl}
          fallback={PLACEHOLDER_IMAGE}
          style={{
            width: currentWidth,
            height: imageHeight,
            borderRadius: 16,
          }}
          resizeMode="cover"
        />


        <Animated.View
          style={{
            position: "absolute",
            top: 6,
            right: 8,
            transform: [{ scale: heartScale }],
          }}
        >
          <Heart
            size={26}
            color={isFollowed ? "#f43f5e" : "#d1d5db"} 
            fill={isFollowed ? "#f43f5e" : "transparent"}
            strokeWidth={isFollowed ? 0.5 : 2.4}
          />
        </Animated.View>
      </View>

      <Text
        className="text-white text-sm font-medium text-center py-2 px-1"
        numberOfLines={2}
      >
        {truncate(item.title, 14)}
      </Text>
    </TouchableOpacity>
  );
}