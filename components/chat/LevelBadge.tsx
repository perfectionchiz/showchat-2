import { LinearGradient } from "expo-linear-gradient";
import { Crown, Flame, Star, User } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

type LevelBadgeProps = {
  level: number;
  className?: string;
};

export const LevelBadge = ({ level, className = "" }: LevelBadgeProps) => {
  const getTier = () => {
    if (level >= 100)
      return {
        colors: ["#7000FF", "#BD00FF"] as const,
        text: "#FFFFFF",
        shadow: "rgba(189, 0, 255, 0.4)",
        icon: <Crown size={8} color="white" fill="white" />,
      };
    if (level >= 50)
      return {
        colors: ["#F59E0B", "#D97706"] as const,
        text: "#FFFFFF",
        shadow: "rgba(245, 158, 11, 0.4)",
        icon: <Flame size={8} color="white" fill="white" />,
      };
    if (level >= 25)
      return {
        colors: ["#6366F1", "#4F46E5"] as const,
        text: "#FFFFFF",
        shadow: "rgba(99, 102, 241, 0.3)",
        icon: <Star size={8} color="white" fill="white" />,
      };
    return {
      colors: ["#334155", "#1E293B"] as const,
      text: "#94A3B8",
      shadow: "transparent",
      icon: <User size={8} color="#64748b" fill="#64748b" opacity={0.6} />,
    };
  };

  const tier = getTier();

  return (
    <View
      style={{
        shadowColor: tier.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 5,
      }}
      className={`self-start flex-row ${className}`}
    >
      <LinearGradient
        colors={tier.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className=" rounded-full border border-white/20"
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 3,
          paddingHorizontal: 3,
        }}
      >
        {tier.icon && <View style={{ marginRight: 4 }}>{tier.icon}</View>}

        <Text
          className="text-xs font-black tracking-tighter"
          style={{ color: tier.text }}
        >
          {level >= 1000 ? `${(level / 1000).toFixed(1)}K` : `LVL ${level}`}
        </Text>
      </LinearGradient>
    </View>
  );
};
