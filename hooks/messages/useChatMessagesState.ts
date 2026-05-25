import { useGetMessages } from "@/hooks/messages/useGetMessages";
import { useMessageActions } from "@/hooks/messages/useMessageAction";
import { useAuthStore } from "@/store/authStore";
import { FlashListRef } from "@shopify/flash-list";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";

export const useChatMessagesState = (
  roomId: string,
  roomType: "live" | "show" | "private",
) => {
  const { user } = useAuthStore();
  const { pin, react, remove, report } = useMessageActions(
    roomId,
    roomType,
    user,
  );
  const [activeTitle, setActiveTitle] = useState<string>("Today");
  const listRef = useRef<FlashListRef<any>>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [firstUnreadTime, setFirstUnreadTime] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const showBtnRef = useRef(false);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useGetMessages(roomId, roomType);

  const handleEndReached = () => {
    if (!hasNextPage || isFetchingNextPage || isLoading) return;
    fetchNextPage();
  };

  const messages = useMemo(() => {
    const all = data?.pages.flatMap((page) => page.messages ?? []) ?? [];
    const result: any[] = [];

    all.forEach((msg, index) => {
      result.push(msg);

      const date = dayjs(msg.created_at);
      const nextMsg = all[index + 1];
      const nextDate = nextMsg ? dayjs(nextMsg.created_at) : null;
      if (!nextDate || !date.isSame(nextDate, "day")) {
        let title = "";
        if (date.isSame(dayjs(), "day")) title = "Today";
        else if (date.isSame(dayjs().subtract(1, "day"), "day"))
          title = "Yesterday";
        else if (date.isAfter(dayjs().subtract(7, "days")))
          title = date.format("dddd");
        else title = date.format("MMMM D, YYYY");

        result.push({
          type: "header",
          id: `header-${title}-${msg.id}`,
          title,
        });
      }
    });

    return result;
  }, [data]);

  const lastSeenTimeRef = useRef<string | null>(
    messages[0]?.created_at || null,
  );

  useEffect(() => {
    const latestMsg = messages[0];

    if (!latestMsg || latestMsg.user_id === user?.id) return;

    const currentLatestTime = latestMsg.created_at;

    const latestTimeMs = new Date(currentLatestTime).getTime();
    const lastSeenTimeMs = lastSeenTimeRef.current
      ? new Date(lastSeenTimeRef.current).getTime()
      : 0;

    const isTrulyNew = latestTimeMs > lastSeenTimeMs;

    if (isTrulyNew) {
      if (!isAtBottom) {
        setUnreadCount((prev) => prev + 1);
        setFirstUnreadTime((prev) => prev ?? currentLatestTime);
      }

      lastSeenTimeRef.current = currentLatestTime;
    }
  }, [messages[0]?.id, isAtBottom, user?.id]);
  const isPrivate = roomType === "private";
  const pinnedMessage = useMemo(() => {
    return isPrivate ? messages.find((m) => m.is_pinned) : null;
  }, [messages, isPrivate]);
  const currentVibe = useMemo(() => {
    const rawMessages = messages.filter((m) => m.type !== "header");

    if (rawMessages.length === 0) return "Quiet ✨";
    const recentSample = rawMessages.slice(0, 25);
    const emojiTally: Record<string, number> = {};

    recentSample.forEach((msg) => {
      if (msg.reactions && typeof msg.reactions === "object") {
        Object.entries(msg.reactions).forEach(([emoji, count]) => {
          emojiTally[emoji] = (emojiTally[emoji] || 0) + Number(count);
        });
      }
    });

    const entries = Object.entries(emojiTally);

    if (entries.length === 0) return "Chillin' 🌊";
    const [topEmoji] = entries.sort((a, b) => b[1] - a[1])[0];

    const vibeMap: Record<string, string> = {
      "🔥": "Lit",
      "😂": "Funny",
      "❤️": "Love",
      "💯": "Hype",
      "😢": "Emotional",
      "🙌": "Blessed",
      "✨": "Magic",
      "🎧": "Vibin'",
      "💀": "Dead",
      "🚀": "Mooning",
      "👀": "Juicy",
      "🫠": "Chaotic",
      "💤": "Sleepy",
      "✅": "Verified",
      "🫡": "Respect",
      "💸": "Rich",
      "🤔": "Curious",
      "🥳": "Party",
    };

    const statusText = vibeMap[topEmoji] || "Vibin'";

    return `${statusText} ${topEmoji}`;
  }, [messages]);
  const mapReactions = (
    reactionsObj: Record<string, number> = {},
    myReactions: string[] = [],
  ) => {
    return Object.entries(reactionsObj).map(([emoji, count]) => ({
      emoji,
      count,
      hasReacted: myReactions.includes(emoji),
    }));
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 60,
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (!viewableItems || viewableItems.length === 0) return;

    const topVisibleItem = [...viewableItems]
      .map((v: any) => v.item)
      .find((item: any) => item?.created_at);

    if (topVisibleItem) {
      const date = dayjs(topVisibleItem.created_at);
      let title = "";
      if (date.isSame(dayjs(), "day")) title = "Today";
      else if (date.isSame(dayjs().subtract(1, "day"), "day"))
        title = "Yesterday";
      else if (date.isAfter(dayjs().subtract(7, "days")))
        title = date.format("dddd");
      else title = date.format("MMMM D, YYYY");
      setActiveTitle((prev) => (prev !== title ? title : prev));
    }

    const atBottom = viewableItems.some((v: any) => v.index === 0);
    setIsAtBottom(atBottom);

    if (atBottom) {
      setUnreadCount(0);
      setFirstUnreadTime(null);
    }
  }).current;

  const scrollToBottom = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const handleScroll = (event: any) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const currentOffset = Math.abs(contentOffset.y);
    const shouldShow = currentOffset > layoutMeasurement.height * 0.5;

    if (shouldShow !== showBtnRef.current) {
      showBtnRef.current = shouldShow;
      setShowScrollBottom(shouldShow);
    }
  };

  return {
    user,
    pin,
    react,
    remove,
    report,
    activeTitle,
    setActiveTitle,
    listRef,
    messages,
    isPrivate,
    pinnedMessage,
    mapReactions,
    handleEndReached,
    isLoading,
    data,
    refetch,
    viewabilityConfig,
    fetchNextPage,
    onViewableItemsChanged,
    hasNextPage,
    isFetchingNextPage,
    unreadCount,
    firstUnreadTimestamp: firstUnreadTime,
    scrollToBottom,
    showScrollBottom,
    handleScroll,
    currentVibe,
  };
};
