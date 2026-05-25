import { PRIMARY_COLOR } from "@/constants/constants";
import { LiveStream } from "@/models/livechat.model";
import { useRoomStore } from "@/store/roomStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { ReactElement, useCallback } from "react";
import { View } from "react-native";
import InfiniteList from "../ui/InfiniteList";
import { Text } from "../ui/Text";
import { LiveCard } from "./LiveCard";

interface LiveListProps {
  liveStreams: LiveStream[];

  isLoading: boolean;
  isError: boolean;

  isFetchingNextPage: boolean;
  hasNextPage?: boolean;

  fetchNextPage: () => void;

  refetch: () => void;

  listHeaderComponent?: ReactElement | null;
}

export default function AlsoLive({
  liveStreams,
  isLoading,
  isError,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  refetch,
  listHeaderComponent = null,
}: LiveListProps) {
  const setRoom = useRoomStore((s) => s.setRoom);

  const renderLiveItem = useCallback(
    ({ item }: { item: LiveStream }) => (
      <View className="px-4">
        <LiveCard
          messageCount={item.viewers}
          watchedBefore={item.watchedBefore}
          variant="compact"
          channelName={item.channelName}
          channelLogo={item.avatarUrl}
          showTitle={item.title}
          roomStatus={item.roomStatus}
          viewers={item.viewers}
          reactions={item.reactions}
          extraReactionsCount={item.extraReactionsCount}
          participantAvatars={item.participantAvatars}
          startsAt={item.startsAt}
          endsAt={item.endsAt}
          onPress={() => {
            setRoom(item);
            router.push({
              pathname: "/home/[roomChatId]",
              params: { roomChatId: `${item.id}` },
            });
          }}
        />
      </View>
    ),
    [],
  );

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Something went wrong (Error loading live streams)</Text>
      </View>
    );
  }

  return (
    <InfiniteList
      data={liveStreams}
      ListHeaderComponent={listHeaderComponent}
      keyExtractor={(item) => item.id}
      renderItem={renderLiveItem}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      skeletonPadding={14}
      description="Clear search or kindly refresh"
      title="No live streams right now"
      isFetchingNextPage={isFetchingNextPage}
      isLoading={isLoading}
      icon={<Ionicons color={PRIMARY_COLOR} size={40} name="tv-outline" />}
      onRefresh={async () => {
        await refetch();
      }}
      showEmptyState
    />
  );
}
