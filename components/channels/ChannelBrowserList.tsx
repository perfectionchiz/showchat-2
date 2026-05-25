import { Channel } from "@/models/channel.model";
import React, { ReactElement, useCallback } from "react";
import InfiniteList from "../ui/InfiniteList";
import { ChannelItem } from "./ChannelItem";

interface ChannelBrowserListProps {
  channels: Channel[];

  isLoading: boolean;
  isFetchingNextPage: boolean;

  hasNextPage?: boolean;
  fetchNextPage: () => void;

  refetch: () => void;

  listHeaderComponent?: ReactElement | null;
}

export default function ChannelBrowserList({
  channels,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  refetch,
  listHeaderComponent = null,
}: ChannelBrowserListProps) {
  const renderLiveItem = useCallback(
    ({ item }: { item: Channel }) => <ChannelItem item={item} />,
    [],
  );

  return (
    <InfiniteList
      data={channels}
      ListHeaderComponent={listHeaderComponent}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderLiveItem}
      fetchNextPage={fetchNextPage}
      showEmptyState
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      isLoading={isLoading}
      onRefresh={async () => {
        await refetch();
      }}
      skeletonCount={3}
      skeletonPadding={14}
    />
  );
}
