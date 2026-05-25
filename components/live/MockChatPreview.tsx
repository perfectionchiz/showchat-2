import { cn } from "@/utils/helper";
import { LinearGradient } from "expo-linear-gradient";
import { EyeIcon } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Text } from "../ui/Text";
import { LiveBadge } from "./LiveBadge";

export type Message = {
  id: string;
  username: string;
  text: string;
  timestamp: number;
};

interface LiveChatPreviewCardProps {
  initialMessages?: Message[];
  chatHeight?: number;
  maxMessages?: number;
}
const getUsernameColor = (username: string): string => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    "text-blue-400",
    "text-cyan-400",
    "text-green-400",
    "text-emerald-400",
    "text-teal-400",
    "text-purple-400",
    "text-fuchsia-400",
    "text-pink-400",
    "text-rose-400",
    "text-orange-400",
    "text-amber-400",
    "text-yellow-400",
  ];
  return colors[Math.abs(hash) % colors.length];
};

export default function MockChatPreviewCard({
  initialMessages = [],
  chatHeight = 300,
  maxMessages = 6,
}: LiveChatPreviewCardProps) {
  const fakeMessagesPool = [
    { username: "ShowRunner", text: "the writers outdid themselves 🔥" },
    { username: "FanGirl99", text: "HIT IT SO HARD ❤️❤️" },
    { username: "FanFanatic", text: "OMG did that just happen?! 😱" },
    { username: "TVBinge", text: "NO WAY I called that last week 🔮" },
    { username: "DramaQueen", text: "I'm literally screaming rn 🔥🔥" },
    { username: "PlotTwistKing", text: "That ending... chefs kiss 👌" },
    { username: "BingeWatcherX", text: "Season 8 vibes all over again 😭" },
    {
      username: "ScreamingFan",
      text: "I need therapy after this episode 😭💔",
    },
  ];

  const [messages, setMessages] = useState<Message[]>(
    initialMessages.length
      ? initialMessages
      : fakeMessagesPool.slice(0, maxMessages).map((msg, index) => ({
          id: `${Date.now()}-${index}`,
          ...msg,
          timestamp: Date.now() - (maxMessages - index) * 1000,
        })),
  );
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg =
        fakeMessagesPool[Math.floor(Math.random() * fakeMessagesPool.length)];
      const newMsg: Message = {
        id: Date.now().toString() + Math.random(),
        ...randomMsg,
        timestamp: Date.now(),
      };

      setMessages((prev) => {
        const updated = [...prev, newMsg];
        return updated.length > maxMessages
          ? updated.slice(-maxMessages)
          : updated;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [maxMessages]);

  const renderMessage = ({ item }: { item: Message }) => {
    const usernameColor = getUsernameColor(item.username);
    return (
      <Animated.View
        entering={FadeInDown.duration(200).springify()}
        className="px-4 py-1.5"
      >
        <Text className="text-sm">
          <Text variant="semibold" className={cn(usernameColor)}>
            {item.username}
          </Text>
          <Text className="text-muted-foreground"> {item.text}</Text>
        </Text>
      </Animated.View>
    );
  };

  return (
    <View
      className="bg-primary rounded-2xl overflow-hidden border border-gray-800/60 shadow-xl shadow-black/40"
      style={{ maxHeight: chatHeight + 50 }}
    >
      <View className=" bg-primary  px-4 py-4 border-b border-gray-700 flex-row items-center gap-3">
        <LinearGradient
          colors={["rgb(244, 64, 52)", "rgb(249, 122, 31)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-full"
          style={{
            overflow: "hidden",
            paddingHorizontal: 6,
            paddingVertical: 2,
            height: 20,
            width: 50,
            borderRadius: 30,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <LiveBadge className="bg-white" dotOnly />
          <Text variant="bold" className="text-white text-xs">
            LIVE
          </Text>
        </LinearGradient>

        <Text variant="semibold" className="text-muted-foreground text-sm">
          The Bachelor
        </Text>
        <View className="flex-row items-center gap-1 ml-auto">
          <EyeIcon size={14} color={"#4ADE80"} />
          <Text style={{ color: "#4ADE80" }} className="text-sm">
            1,924
          </Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        inverted
        style={{ height: chatHeight }}
        contentContainerStyle={{
          justifyContent: "flex-start",
          paddingHorizontal: 0,
          paddingTop: 6,
          paddingBottom: 6,
        }}
        initialNumToRender={maxMessages}
        maxToRenderPerBatch={maxMessages}
      />
      <View className="p-3">
        <View
          className="p-3 rounded-lg flex flex-row justify-between"
          style={{ backgroundColor: "rgba(32, 40, 60, 0.5)" }}
        >
          <Text className="text-gray-400">Say something...</Text>
          <Text>😂 🔥 ❤️</Text>
        </View>
      </View>
    </View>
  );
}
