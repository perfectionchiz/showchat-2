import { Message, SilentModeViewProps } from "@/models/livechat.model";
import { getInitials } from "@/utils/getInitials";
import { resolveVibe } from "@/utils/resolveVibe";
import { truncate } from "@/utils/truncate";
import { router } from "expo-router";
import {
  ArrowLeft,
  MessageCircle,
  Sparkles,
  Volume2,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { formatTime } from "@/utils/formatTime";
import { Button } from "../common/Button";
import { IconButton } from "../common/IconButton";
import { LiveBadge } from "../live/LiveBadge";
import FallbackImage from "../ui/FallbackImage";
import { Text } from "../ui/Text";

export function SilentModeView({
  roomVibe,
  programTitle,
  channelName,
  channelLogo,
  isLive,
  recentCounts,
  onExpandChat,
  isLoading,
  roomStatus,
  messages: mockPool,
}: SilentModeViewProps) {
  const v = resolveVibe(roomVibe || "");
  const scrollRef = useRef<ScrollView>(null);

  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [poolIndex, setPoolIndex] = useState(0);
  const isLiveChat =
    roomStatus !== undefined && roomStatus !== null
      ? roomStatus === "live"
      : !!isLive;
  useEffect(() => {
    if (mockPool && mockPool.length > 0) {
      setVisibleMessages(mockPool.slice(0, 5));
      setPoolIndex(5);
    }
  }, [mockPool]);

  useEffect(() => {
    if (!mockPool || mockPool.length === 0) return;

    const interval = setInterval(() => {
      setVisibleMessages((prev) => {
        const next = mockPool[poolIndex % mockPool.length];

        const ghostMsg: Message = {
          ...next,
          id: `${Date.now()}-${Math.random()}`,
          created_at: new Date().toISOString(),
        };

        const updated = [...prev, ghostMsg];
        return updated.slice(-5);
      });

      setPoolIndex((prev) => prev + 1);

      scrollRef.current?.scrollToEnd({ animated: true });
    }, 2600);

    return () => clearInterval(interval);
  }, [mockPool, poolIndex]);

  return (
    <View className="flex-1">
      <View className="px-4 py-7 flex-row items-center">
        <IconButton
          onPress={() => router.back()}
          icon={<ArrowLeft size={20} color="#fff" />}
          className=" mr-3 bg-primary rounded-full"
        />

        <View className="flex-1">
          <View className="flex-row items-center gap-1 mb-1">
            <View className="flex-row gap-x-2 items-center">
              {channelLogo && (
                <View className="w-6 h-6 overflow-hidden rounded-lg mr-1">
                  <FallbackImage
                    uri={channelLogo}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
              )}

              <Text variant="medium" className="text-sm text-muted-foreground">
                {channelName}
              </Text>

              {isLiveChat ? (
                <LiveBadge />
              ) : (
                <View className="bg-blue-500 rounded-lg px-2">
                  <Text
                    variant="semibold"
                    className="text-sm uppercase text-white"
                  >
                    Ended
                  </Text>
                </View>
              )}

              <Text
                variant="semibold"
                className="text-muted-foreground text-sm"
              >
                {v.label} {v.emoji}
              </Text>
            </View>
          </View>

          <Text
            variant="semibold"
            numberOfLines={1}
            className="text-white text-xl"
          >
            {truncate(programTitle, 20)}
          </Text>
        </View>

        <IconButton
          disabled={!isLiveChat}
          onPress={onExpandChat}
          icon={<Volume2 size={20} color={isLive ? "#fff" : "#95A3B8"} />}
          className=" ml-2 rounded-full bg-primary"
        />
      </View>

      <ScrollView
        ref={scrollRef}
        scrollEnabled={false}
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
      >
        {visibleMessages.map((msg) => (
          <Animated.View
            key={msg.id}
            entering={FadeInDown.duration(220).springify()}
          >
            <View className="flex-row mb-4 items-start">
              <View className="mr-3">
                {msg.profile_url ? (
                  <View className="w-10 h-10 rounded-full overflow-hidden">
                    <FallbackImage
                      uri={msg.profile_url}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </View>
                ) : (
                  <View className="w-10 h-10 rounded-full bg-secondary/10 items-center justify-center">
                    <Text variant="medium" className="text-sm text-secondary">
                      {getInitials(msg.display_name)}
                    </Text>
                  </View>
                )}
              </View>
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text variant="semibold" className="text-white text-md mr-2">
                    {msg.display_name}
                  </Text>

                  <Text className="text-xs text-gray-400">
                    {formatTime(msg.created_at)}
                  </Text>
                </View>

                <Text className="text-muted-foreground mt-0.5">
                  {msg.message}
                </Text>
              </View>
            </View>
          </Animated.View>
        ))}
      </ScrollView>

      {recentCounts.length > 0 && (
        <View className="absolute top-24 right-4 bg-[#111827] px-3 py-1 rounded-full flex-row items-center border border-white/10">
          <Sparkles size={12} color="#f87171" />
          {recentCounts.slice(0, 3).map((r) => (
            <Text key={r.emoji} className="text-lg ml-1">
              {r.emoji}
            </Text>
          ))}
        </View>
      )}

      <View className="p-4 bg-primary">
        <View className="pb-5">
          <Button
            icon={<MessageCircle size={16} color="#fff" />}
            onPress={onExpandChat}
            variant="ghost"
            isLoading={isLoading}
            disabled={!isLiveChat || isLoading}
            size="lg"
            style={{ borderColor: "rgb(139 92 246 / 0.15)" }}
            className="border rounded-2xl mx-auto"
          >
            {isLiveChat ? " Join the chat" : "Live chat ended"}
          </Button>
        </View>
      </View>
    </View>
  );
}
