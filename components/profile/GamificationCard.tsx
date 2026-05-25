import { Text } from "@/components/ui/Text";
import { PRIMARY_COLOR } from "@/constants/constants";
import { User } from "@/models/auth.model";
import { getBadgeGem } from "@/utils/getBadgeGem";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { GemIcon } from "lucide-react-native";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { Skeleton } from "./Skeleton";

interface Props {
  profile: User | undefined;
  gamification?: {
    xp?: number;
    level?: number;
    level_name?: string;
    current_streak?: number;
    longest_streak?: number;
    xp_to_next_level?: number;
    badges?: {
      badge_type: string;
      badge_name: string;
    }[];
  };
  loading?: boolean;
  openSub: (open: boolean) => void;
  openBadge: (open: boolean) => void;
}

export const GamificationCard: React.FC<Props> = ({
  gamification,
  loading = false,
  profile,
  openSub,
  openBadge,
}) => {
  const maxXp = gamification?.xp_to_next_level ?? 100;
  const currentXp = gamification?.xp ?? 0;
  const progressPercentage = Math.min((currentXp / maxXp) * 100, 100);
  const isLevelComplete = currentXp >= maxXp;
  if (loading) {
    return <Skeleton />;
  }

  return (
    <TouchableOpacity
      onPress={() => openBadge(true)}
      className="mt-8  rounded-2xl "
    >
      <View
        className="absolute items-center justify-center w-full"
        pointerEvents="box-none"
        style={{
          top: -40,
          zIndex: 100,
        }}
      >
        <View
          style={
            Platform.OS !== "web" && {
              position: "absolute",
              width: 90,
              height: 90,

              shadowColor: "#3B82F6",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.9,
              shadowRadius: 30,
              elevation: 30,
            }
          }
        />

        <Image
          source={getBadgeGem(gamification?.level_name || "")}
          style={{
            width: 100,
            height: 100,
          }}
          resizeMode="contain"
        />
      </View>
      <LinearGradient
        colors={["#020617", "#0F172A", "#172554"]}
        className="px-5 py-8  relative"
        style={{ padding: 20, borderRadius: 20 }}
      >
        <View
          style={{ top: 20, left: 20 }}
          className="absolute  items-center justify-center"
        >
          <View className="relative items-center justify-center">
            <View
              style={{
                borderColor: PRIMARY_COLOR,
                width: 70,
                height: 70,
              }}
              className="rounded-full border-2 overflow-hidden"
            >
              <Image
                source={
                  profile?.avatar_url
                    ? { uri: profile?.avatar_url }
                    : require("@/assets/images/avatar.jpg")
                }
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>

            {gamification?.current_streak !== 0 && (
              <View
                className="absolute -bottom-1 -right-1 flex-row items-center justify-center bg-orange-500 rounded-full px-1.5 py-0.5 border border-orange-300"
                style={{
                  shadowColor: "#F97316",
                  shadowOpacity: 1,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 0 },
                  elevation: 8,
                }}
              >
                <Ionicons name="flame" size={17} color="#fff" />

                <Text className="text-white text-[12px] font-bold ml-0.5">
                  {gamification?.current_streak ?? 0}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View
          style={{ top: 20, right: 10, zIndex: 200 }}
          className=" absolute right-0 top-3 justify-between "
        >
          {profile?.is_premium ? (
            <View
              className="flex-row items-center bg-[#1a1a1a] px-5 py-2.5 rounded-2xl shadow-lg shadow-black/20"
              style={{ elevation: 5 }}
            >
              <GemIcon color="#f59e0b" size={16} />
              <Text className="text-white font-black uppercase text-[11px] tracking-widest ml-2">
                Premium
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => openSub(true)}
              className="flex-row items-center bg-yellow-600 px-4 py-3 rounded-2xl shadow-xl shadow-yellow-500/40"
              style={{ elevation: 8, zIndex: 600 }}
            >
              <GemIcon color="#fff" size={18} />
              <Text
                variant="medium"
                className="text-white  uppercase text-[12px] tracking-widest ml-2"
              >
                Upgrade
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View className="mt-4">
          <Text
            variant="semibold"
            className="text-white text-center mt-10 text-xl  uppercase tracking-tighter"
          >
            {gamification?.level_name}
          </Text>
          <View className="flex-row  items-center justify-center ml-2 gap-x-1">
            <Text className="text-gray-400 text-md text-center uppercase tracking-widest">
              Level
            </Text>
            <Text
              variant="semibold"
              className="text-white text-lg uppercase tracking-widest"
            >
              {gamification?.level}
            </Text>
          </View>
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-white/80">XP</Text>

            <View className="flex-row items-baseline">
              <Text className="text-white font-medium">{currentXp}</Text>
              <Text className="text-gray-400 ">/{maxXp}</Text>
            </View>
          </View>
          <View className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
            <View className="absolute inset-0 bg-white/5" />

            <View
              style={{
                width: `${progressPercentage}%`,
              }}
              className={`h-full ${isLevelComplete ? "text-green-500" : "bg-yellow-500"} rounded-full`}
            >
              <View
                className="h-full w-full"
                style={{
                  shadowColor: "#FACC15",
                  shadowOpacity: 0.9,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 0 },
                  elevation: 8,
                }}
              />
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};
