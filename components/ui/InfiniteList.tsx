import { FlashList, FlashListRef, ListRenderItem } from "@shopify/flash-list";
import { ArrowUp } from "lucide-react-native";
import React, { ReactNode, useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { Button } from "../common/Button";
import EmptyState from "./EmptyState";
import SkeletonText from "./skeleton/SkeletonText";

interface InfiniteListProps<T> {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  icon?: ReactNode;
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  buttonIcon?: ReactNode;
  description?: string;
  title?: string;
  isLoading: boolean;
  onRefresh?: () => void | Promise<void>;

  ListHeaderComponent?: React.ReactElement | null;
  ListEmptyComponent?: React.ReactElement | null;
  numColumns?: number;
  showEmptyState?: boolean;

  skeletonCount?: number;
  skeletonPadding?: number;

  contentContainerStyle?: any;
}

export default function InfiniteList<T>({
  data,
  renderItem,
  keyExtractor,
  isLoading,
  onRefresh,
  ListHeaderComponent,
  numColumns = 1,
  showEmptyState = true,
  skeletonCount = 6,
  skeletonPadding = 5,
  contentContainerStyle,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  icon,
  buttonIcon,
  description,
  title,
}: InfiniteListProps<T>) {
  const [refreshing, setRefreshing] = useState(false);
  const listRef = useRef<FlashListRef<T>>(null);

  const [showBackToTop, setShowBackToTop] = useState(false);
  const showRef = useRef(false);

  const isInitialLoading = isLoading && data.length === 0;
  const shouldShowSkeletons = isInitialLoading && !refreshing;

  const shouldShowEmpty =
    !isInitialLoading &&
    !isFetchingNextPage &&
    data.length === 0 &&
    showEmptyState;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const shouldShow = offsetY > 300;

    if (shouldShow !== showRef.current) {
      showRef.current = shouldShow;
      setShowBackToTop(shouldShow);
    }
  };

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const handleEndReached = () => {
    if (!hasNextPage || isFetchingNextPage || isLoading) return;
    fetchNextPage();
  };

  const renderSkeletonItem = useCallback(
    () => (
      <View
        style={{
          flex: 1 / numColumns,
          paddingHorizontal: skeletonPadding,
          paddingVertical: 6,
        }}
      >
        <SkeletonText height={140} />
      </View>
    ),
    [numColumns, skeletonPadding],
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;

    return (
      <View>
        <ActivityIndicator color="#f44034" size="small" />
        <Text className="text-gray-500 text-center text-[10px] mt-2 uppercase tracking-tighter">
          Loading more...
        </Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (!shouldShowEmpty) return null;

    return (
      <View className="flex-1 my-12 justify-center items-center">
        <EmptyState
          icon={icon}
          description={description || "Clear search or kindly refresh"}
          title={title || "Oops no data found"}
          buttonText="Tap to refresh"
          onButtonPress={onRefresh}
          buttonIcon={buttonIcon}
        />
      </View>
    );
  };

  const finalData = shouldShowSkeletons
    ? (Array.from({ length: skeletonCount }) as unknown as T[])
    : data;

  const finalRenderItem: ListRenderItem<T> = shouldShowSkeletons
    ? () => renderSkeletonItem()
    : renderItem;

  const finalKeyExtractor = shouldShowSkeletons
    ? (_: any, index: number) => `skeleton-${index}`
    : keyExtractor;

  return (
    <View className="flex-1 relative">
      <FlashList
        ref={listRef}
        data={finalData}
        renderItem={finalRenderItem}
        keyExtractor={finalKeyExtractor}
        numColumns={numColumns}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="white"
            />
          ) : undefined
        }
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
      />

      {showBackToTop && (
        <Button
          icon={<ArrowUp size={20} color="#000" />}
          onPress={scrollToTop}
          className="absolute bottom-6 right-8 bg-white h-10 w-10 rounded-full shadow-lg"
        />
      )}
    </View>
  );
}
