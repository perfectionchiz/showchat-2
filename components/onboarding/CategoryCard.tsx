import { PRIMARY_COLOR } from "@/constants/constants";
import { type LucideIcon } from "lucide-react-native";
import { useRef } from "react";
import { Animated, Pressable } from "react-native";
import { Text } from "../ui/Text";

interface CategoryCardProps {
  label: string;
  Icon: LucideIcon;
  active: boolean;
  onPress: () => void;
}

export function CategoryCard({
  label,
  Icon,
  active,
  onPress,
}: CategoryCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }} className=" mb-1">
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          backgroundColor: active ? PRIMARY_COLOR : "rgb(209 213 219 / 0.05)",
          borderColor: active ? PRIMARY_COLOR : " rgb(209 213 219 / 0.05)",
        }}
        className={`rounded-3xl px-3 py-2 border  flex-row items-center gap-x-2 relative `}
      >
        <Icon size={20} color={active ? "#fff" : "#d1d5db"} />

        <Text
          variant="medium"
          className={` ${active ? "text-white" : "text-gray-300"}`}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
