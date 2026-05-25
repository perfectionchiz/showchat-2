import { PRIMARY_COLOR } from "@/constants/constants";
import { useGetTmdbShows } from "@/hooks/show-chats/useGetTmdbShows";
import { truncate } from "@/utils/truncate";
import { ListRenderItem } from "@shopify/flash-list";
import { ArrowRightIcon } from "lucide-react-native";
import React, { useMemo } from "react";
import { Dimensions, Platform, View } from "react-native";
import { Button } from "../common/Button";
import InfiniteList from "../ui/InfiniteList";
import { Text } from "../ui/Text";
import { ShowCard } from "./FollowShowCard";

interface ShowItem {
  id: string;
  title: string;
  posterUrl: string;
  genre: string;
}

interface ShowsScreenProps {
  completeShows: () => void;
  userGenres: string[];
  isPending: boolean;
  followedShows: string[];
  setFollowedShows: (
    updater: string[] | ((prev: string[]) => string[]),
  ) => void;
}

export default function FollowShowsScreen({
  completeShows,
  isPending,
  userGenres,
  followedShows,
  setFollowedShows,
}: ShowsScreenProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useGetTmdbShows(userGenres);
  const tmdbShows = data?.pages?.flatMap((p) => p.data ?? []) ?? [];

  const shows: ShowItem[] = useMemo(() => {
    return tmdbShows.map((item) => ({
      id: String(item.tmdb_id),
      title: item.title,
      posterUrl: item.poster_url || "",
      genre: item.genre_ids?.join(", ") ?? "",
    }));
  }, [tmdbShows]);

  const numColumns = 3;
  const screenWidth = Dimensions.get("window").width;

  const imageMargin = 8;
  const imageWidth =
    (screenWidth - imageMargin * (numColumns * 2)) / numColumns;

  const imageHeight = imageWidth * 1.1;

  const toggleFollow = (showId: string) => {
    setFollowedShows((prev) =>
      prev.includes(showId)
        ? prev.filter((id) => id !== showId)
        : [...prev, showId],
    );
  };

  const shouldShowEmptyState = !isLoading && shows.length === 0;

  const renderItem: ListRenderItem<ShowItem> = ({ item, index }) => (
    <ShowCard
      item={item}
      index={index}
      totalItems={shows.length}
      numColumns={numColumns}
      screenWidth={screenWidth}
      imageWidth={imageWidth}
      imageHeight={imageHeight}
      imageMargin={imageMargin}
      followedShows={followedShows}
      toggleFollow={toggleFollow}
      truncate={truncate}
    />
  );

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <View className="flex-1">
      <View className="pt-6 pb-2">
        <Text variant="bold" className="text-white text-3xl">
          Which shows or channels do you love?
        </Text>

        <Text className="text-gray-400 text-lg mt-3 mb-6">
          Tap to follow — we&apos;ll notify you about new episodes & discussions
        </Text>
      </View>
      <View className="flex-1">
        <InfiniteList
          data={shows}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
          showEmptyState={shouldShowEmptyState}
          onRefresh={handleRefresh}
          skeletonCount={6}
          numColumns={numColumns}
        />
      </View>

      <View
        className={`px-6 pt-5 ${
          Platform.OS === "web" || Platform.OS === "android" ? "pb-8" : ""
        }`}
      >
        <Button
          size="lg"
          className="rounded-full shadow-xl"
          style={{ backgroundColor: PRIMARY_COLOR }}
          isLoading={isPending}
          disabled={followedShows.length < 3 || isPending || isLoading}
          rightIcon={<ArrowRightIcon size={20} color="#fff" />}
          onPress={completeShows}
        >
          {followedShows.length > 0
            ? `Continue (${followedShows.length} followed)`
            : "Continue"}
        </Button>
      </View>
    </View>
  );
}
