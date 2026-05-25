import { PRIMARY_COLOR } from "@/constants/constants";
import { useOpenChat } from "@/hooks/show-chats/useOpenChat";
import { SearchShowChatItem, ShowChatItem } from "@/models/tmdb.model";
import { Ionicons } from "@expo/vector-icons";
import React, { ReactElement, useCallback, useState } from "react";
import { View } from "react-native";
import InfiniteList from "../ui/InfiniteList";
import { LiveCard } from "./LiveCard";

interface ShowChatListProps {
  query?: string;
  listHeaderComponent: ReactElement | null;
  data: ShowChatItem[] | SearchShowChatItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  hasNextPage?: boolean;

  fetchNextPage: () => void;

  refetch: () => void;
  action: "search" | "trending";
}

export default function ShowChatList({
  data,
  isLoading,
  fetchNextPage,
  refetch,
  hasNextPage,
  isError,
  listHeaderComponent,
  isFetchingNextPage,
}: ShowChatListProps) {
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());

  const { mutate } = useOpenChat();

  const renderLiveItem = useCallback(
    ({ item }: { item: any }) => {
      const isPending = pendingIds.has(item.tmdb_id);

      return (
        <View className="px-4">
          <LiveCard
            messageCount={0}
            variant="show"
            avatarUrl={item.poster_url || ""}
            title={item.title}
            year={item.first_air_date}
            showType={item.media_type}
            votes={item.vote_average}
            description={item.overview}
            isPending={isPending}
            onPress={() => {
              if (!item.tmdb_id || isPending) return;

              setPendingIds((prev) => new Set(prev).add(item.tmdb_id));

              mutate(
                {
                  tmdb_id: item.tmdb_id.toString(),
                  media_type: item.media_type,
                },
                {
                  onSettled: () => {
                    setPendingIds((prev) => {
                      const next = new Set(prev);
                      next.delete(item.tmdb_id);
                      return next;
                    });
                  },
                },
              );
            }}
          />
        </View>
      );
    },
    [pendingIds, mutate],
  );

  return (
    <InfiniteList
      data={data as any}
      ListHeaderComponent={listHeaderComponent}
      keyExtractor={(item, index) => item.tmdb_id}
      renderItem={renderLiveItem}
      fetchNextPage={fetchNextPage}
      title="No trending show found"
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      isLoading={isLoading}
      icon={<Ionicons color={PRIMARY_COLOR} size={50} name="film-outline" />}
      onRefresh={async () => {
        await refetch();
      }}
      showEmptyState
      skeletonCount={2}
      skeletonPadding={14}
    />
  );
}
