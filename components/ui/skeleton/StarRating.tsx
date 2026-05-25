import { Star, StarHalf, Star as StarOutline } from "lucide-react-native";
import React from "react";
import { StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";

interface StarRatingProps {
  vote_average: number;
  size?: number;
  filledColor?: string;
  emptyColor?: string;
  showText?: boolean;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  spacing?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  vote_average,
  size = 16,
  filledColor = "#FFD700",
  emptyColor = "#4A4A4A",
  showText = true,
  textStyle,
  containerStyle,
  spacing = 3,
}) => {
  const ratingOutOf5 = Math.max(0, Math.min(5, vote_average / 2));

  const fullStars = Math.floor(ratingOutOf5);
  const hasHalfStar = ratingOutOf5 % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing,
        },
        containerStyle,
      ]}
    >
      {Array.from({ length: fullStars }).map((_, idx) => (
        <Star
          key={`full-${idx}`}
          size={size}
          color={filledColor}
          strokeWidth={2.5}
        />
      ))}

      {hasHalfStar ? (
        <StarHalf
          key="half"
          size={size}
          color={filledColor}
          strokeWidth={2.5}
        />
      ) : null}

      {Array.from({ length: emptyStars }).map((_, idx) => (
        <StarOutline
          key={`empty-${idx}`}
          size={size}
          color={emptyColor}
          strokeWidth={2.5}
        />
      ))}

      {showText ? (
        <Text
          style={[
            {
              marginLeft: 4,
              fontSize: Math.floor(size * 0.88),
              color: "#E0E0E0",
              fontWeight: "600",
              letterSpacing: 0.3,
            },
            textStyle,
          ]}
        >
          {ratingOutOf5.toFixed(1)}
        </Text>
      ) : null}
    </View>
  );
};
