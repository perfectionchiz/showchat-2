import { MomentType } from "@/hooks/profile/useUserMoments";
import { Flame, Rocket, Sparkles, XCircle } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { IconButton } from "../common/IconButton";

interface UserMomentBannerProps {
  type: MomentType;
  streak: number;
  extraData?: {
    xpRemaining?: number;
    nextLevel?: number;
    newLevel?: number;
  };
  dismiss: () => void;
  isVisible: boolean;
}

export const UserMomentBanner = ({
  type,
  streak,
  extraData,
  dismiss,
  isVisible,
}: UserMomentBannerProps) => {
  if (!isVisible || !type) return null;

  const config = {
    STREAK: {
      icon: <Flame size={20} color="#fb923c" />,
      text: `Don't lose your ${streak}-day streak! Join a room to keep it alive.`,
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      textColor: "text-orange-400",
      iconColor: "#fb923c",
    },
    XP_PROGRESS: {
      icon: <Rocket size={20} color="#60a5fa" />,
      text: `Almost there! Only ${extraData?.xpRemaining ?? 0} XP left until Level ${extraData?.nextLevel ?? ""}!`,
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      textColor: "text-blue-400",
      iconColor: "#60a5fa",
    },
    LEVEL_UP: {
      icon: <Sparkles size={20} color="#facc15" />,
      text: `Level Up! You've reached Level ${extraData?.newLevel ?? ""}! Keep it up.`,
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      textColor: "text-yellow-500",
      iconColor: "#facc15",
    },
  };

  const current = config[type as keyof typeof config];
  if (!current) return null;

  return (
    <View
      className={`flex-row items-center gap-2 px-4 py-2.5 mb-6 rounded-xl border ${current.bgColor} ${current.borderColor}`}
    >
      {current.icon}

      <Text
        className={`${current.textColor} text-[15px] leading-5 flex-1 font-semibold`}
      >
        {current.text}
      </Text>

      <IconButton
        icon={<XCircle size={20} color={current.iconColor} />}
        onPress={dismiss}
        size={30}
        className="bg-transparent"
      />
    </View>
  );
};
