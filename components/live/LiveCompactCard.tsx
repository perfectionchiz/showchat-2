import { calculateProgress } from "@/utils/formatViewer";
import { Eye, MessageCircle } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { AnimatedAvatar } from "../common/AnimatedAvatar";
import { AnimatedEmojis } from "../ui/AnimatedEmoji";
import FallbackImage from "../ui/FallbackImage";
import { Text } from "../ui/Text";
import { LiveBadge } from "./LiveBadge";

interface LiveCardProps {
  channelLogo?: string;
  channelName?: string;
  showTitle?: string;
  viewers: number;
  reactions?: { emoji: string; count: number }[];
  participantAvatars: { user_id: string; display_name: string }[];
  extraParticipantsCount?: number;
  extraReactionsCount?: number;
  endsAt?: string;
  startsAt?: string;
  isLive: boolean;
  messageCount: number;
  roomStatus?: "live" | "ended" | "scheduled";
  watchedBefore?: boolean;
}

export const LiveCompactCard: React.FC<LiveCardProps> = ({
  channelLogo,
  channelName,
  showTitle,
  reactions,
  participantAvatars,
  extraParticipantsCount = 0,
  endsAt,
  startsAt,
  isLive,
  messageCount,
  roomStatus,
  watchedBefore,
}) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, [isLive]);
  const progress = useMemo(() => {
    if (!isLive) return 100;
    const p = calculateProgress(startsAt ?? "", endsAt ?? "");
    return Math.max(0, Math.min(100, p));
  }, [startsAt, endsAt, tick, isLive]);

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: isLive ? 1000 : 400,
      useNativeDriver: false,
    }).start();
  }, [progress, isLive]);

  return (
    <View className="p-3 pb-3 rounded-xl">
      <View className="flex-row gap-2">
        <View className="p-1 bg-white overflow-hidden rounded-xl w-16 h-16">
          <FallbackImage
            uri={channelLogo}
            className="w-full h-full object-cover"
            style={{ width: "100%", height: "100%" }}
          />
        </View>

        <View className="flex-1 ml-1">
          <View className="flex-row items-center gap-x-2">
            <Text variant="medium" className="text-muted-foreground">
              {channelName}
            </Text>

            {roomStatus === "live" ? (
              <LiveBadge />
            ) : (
              <Text className="text-sm text-muted-foreground italic">
                Ended
              </Text>
            )}
            {watchedBefore && (
              <View className="flex-row items-center bg-white/10 px-1.5 py-0.5 rounded-full">
                <Eye size={10} color="#9ca3af" />
                <Text className="text-[10px] text-gray-400 ml-1 uppercase font-bold">
                  Watched
                </Text>
              </View>
            )}
          </View>

          <Text variant="semibold" className="text-white mt-0.5">
            {showTitle}
          </Text>

          <View className="flex-row items-center mt-2">
            <View className="flex-row items-center mr-3">
              <MessageCircle size={12} color="#4ade80" />
              <Text variant="medium" className="ml-1 text-sm text-green-400">
                {messageCount?.toLocaleString()}
              </Text>
            </View>

            <AnimatedEmojis
              key={`emojis-${tick}-${reactions?.length}`}
              emojis={reactions || []}
            />

            <View className="flex-row items-center ml-2">
              {participantAvatars?.slice(0, 4).map((user, i) => (
                <AnimatedAvatar
                  key={i}
                  uri={user.display_name}
                  size={23}
                  className={i > 0 ? "-ml-2" : ""}
                />
              ))}

              {extraParticipantsCount > 0 && (
                <View className="px-1.5 py-0.5 rounded">
                  <Text className="text-muted-foreground text-[10px]">
                    +{extraParticipantsCount.toLocaleString()}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden w-full">
            <Animated.View
              className="h-full bg-secondary"
              style={{
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
