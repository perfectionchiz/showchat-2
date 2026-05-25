import { useStickers } from "@/hooks/stickers/useTrendingStickers";
import { User } from "@/models/auth.model";
import { useMemo, useState } from "react";
import { Dimensions, Keyboard as RNKeyboard } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useRealtimeReactions } from "../room/useRealTimeReactions";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface UseChatFooterProps {
  onReaction?: (emoji: string) => void;
  roomId: string;
  user: User | null;
}

export const useChatSend = ({
  onReaction,
  roomId,
  user,
}: UseChatFooterProps) => {
  const [mode, setMode] = useState<"chat" | "emoji">("chat");
  const [showExtras, setShowExtras] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeTab, setActiveTab] = useState<"stickers" | "reactions">(
    "stickers",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [flyingEmojis, setFlyingEmojis] = useState<any[]>([]);
  const { sendReaction, removeEmoji } = useRealtimeReactions(
    roomId,
    user,
    setFlyingEmojis,
  );
  const iconsOpacity = useSharedValue(1);
  const slideX = useSharedValue(0);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useStickers(searchQuery, activeTab);

  const stickers = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.items);
  }, [data]);

  const switchToChat = () => {
    slideX.value = withTiming(0, { duration: 250 });
    setMode("chat");
  };

  const switchToEmoji = () => {
    slideX.value = withTiming(-SCREEN_WIDTH, { duration: 250 });
    setMode("emoji");
  };
  const toggleMode = () => {
    const isChat = mode === "chat";
    slideX.value = withTiming(isChat ? -SCREEN_WIDTH : 0, { duration: 250 });

    setMode(isChat ? "emoji" : "chat");
  };
  const toggleExtras = () => {
    if (showExtras) {
      setShowExtras(false);
    } else {
      RNKeyboard.dismiss();
      setTimeout(() => {
        setShowExtras(true);
        switchToChat();
      }, 100);
    }
  };

  const onFocus = () => {
    setIsFocused(true);
    setShowExtras(false);
    iconsOpacity.value = withTiming(0, { duration: 250 });
    switchToChat();
  };

  const onBlur = () => {
    setIsFocused(false);
    iconsOpacity.value = withTiming(1, { duration: 250 });
  };

  const handleReactionInternal = (emoji: string) => {
    sendReaction(emoji);
    onReaction?.(emoji);
  };

  const removeFlyingEmoji = (id: number) => {
    removeEmoji(id as any);
    setFlyingEmojis((prev) => prev.filter((item) => item.id !== id));
  };

  const iconsStyle = useAnimatedStyle(() => {
    const baseWidth = 45;
    return {
      opacity: iconsOpacity.value,
      width: withTiming(isFocused ? 0 : baseWidth, { duration: 250 }),
      marginRight: withTiming(isFocused ? 0 : 4, { duration: 250 }),
    };
  });

  const inputSlideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
  }));

  const emojiSlideStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    transform: [{ translateX: slideX.value + SCREEN_WIDTH }],
  }));

  return {
    mode,
    showExtras,
    setShowExtras,
    isFocused,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    flyingEmojis,
    stickers,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    toggleExtras,
    switchToChat,
    switchToEmoji,
    onFocus,
    onBlur,
    handleReactionInternal,
    removeFlyingEmoji,
    iconsStyle,
    inputSlideStyle,
    emojiSlideStyle,
    toggleMode,
    setFlyingEmojis,
  };
};
