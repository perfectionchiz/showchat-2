import { LiveStream } from "@/models/livechat.model";
import { useRoomStore } from "@/store/roomStore";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";
import { LiveCard } from "../live/LiveCard";
import EmptyState from "../ui/EmptyState";
import { Text } from "../ui/Text";
import PosterSectionList from "./PosterSectionList";
import SkeletonRow from "./SkeletonRow";

interface Section {
  title: string;
  icon: ReactElement;
  data: LiveStream[];
}

interface GuideListProps {
  sections: Section[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  listHeaderComponent?: ReactElement | null;
  trendingStreams: LiveStream[];
  recommendedStreams: LiveStream[];
  guideData: any;
  title: string;
}

const ROTATE_INTERVAL = 8000;

const isEmpty = (data?: any[]) => !data || data.length === 0;

export default function GuideList({
  sections,
  isLoading,
  listHeaderComponent = null,
  trendingStreams,
  guideData,
  recommendedStreams,
  isError,
  title,
  refetch,
}: GuideListProps) {
  const setRoom = useRoomStore((s) => s.setRoom);
  const { width: SCREEN_WIDTH } = Dimensions.get("window");

  const GRID_COLUMNS = 3;
  const CARD_MARGIN = 12;
  const SIDE_PADDING = 16;

  const GROUP_WIDTH = SCREEN_WIDTH - SIDE_PADDING * 2;

  const CARD_WIDTH =
    (GROUP_WIDTH - CARD_MARGIN * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

  const [activeIndexes, setActiveIndexes] = useState<Record<string, number>>(
    {},
  );
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const fadeAnimMap = useRef<Record<string, Animated.Value>>({});

  const getFade = (key: string) => {
    if (!fadeAnimMap.current[key]) {
      fadeAnimMap.current[key] = new Animated.Value(1);
    }
    return fadeAnimMap.current[key];
  };

  const renderLiveItem = useCallback(
    (item: LiveStream, width: number) => (
      <View style={{ width, paddingHorizontal: CARD_MARGIN }}>
        <LiveCard
          messageCount={item.messageCount}
          bgVariant="full"
          variant="guide"
          avatarUrl={item.avatarUrl}
          title={item.title}
          timeslot={item.timeslot}
          showType={item.showType}
          viewers={item.viewers}
          banner={item.banner}
          isLive={item.isLive}
          participantAvatars={item.participantAvatars}
          reactions={item.reactions}
          description={item.description}
          vibe={item.vibe}
          channelName={item.channelName}
          onPress={() => {
            setRoom(item);
            router.push({
              pathname: "/guide/[roomChatId]",
              params: { roomChatId: `${item.id}` },
            });
          }}
        />
      </View>
    ),
    [setRoom],
  );

  const finalSections = sections.map((section) => {
    const title = section.title.toLowerCase().trim();

    if (title === "trending live") {
      return { ...section, data: trendingStreams };
    }

    if (title === "recommended for you") {
      return { ...section, data: recommendedStreams };
    }

    return section;
  });

  useEffect(() => {
    const intervals: any[] = [];

    finalSections.forEach((section) => {
      const key = section.title;

      if (
        section.title === "Trending Live" ||
        section.title === "Recommended For You"
      ) {
        if (section.data.length <= 1) return;

        const interval = setInterval(() => {
          setProgressMap((prev) => {
            const current = prev[key] || 0;

            if (current >= 100) {
              const fade = getFade(key);

              Animated.sequence([
                Animated.timing(fade, {
                  toValue: 0,
                  duration: 250,
                  useNativeDriver: true,
                }),
                Animated.timing(fade, {
                  toValue: 1,
                  duration: 250,
                  useNativeDriver: true,
                }),
              ]).start();

              setActiveIndexes((prevIndex) => ({
                ...prevIndex,
                [key]: ((prevIndex[key] || 0) + 1) % section.data.length,
              }));

              return { ...prev, [key]: 0 };
            }

            return {
              ...prev,
              [key]: current + 100 / (ROTATE_INTERVAL / 50),
            };
          });
        }, 50);

        intervals.push(interval);
      }
    });

    return () => intervals.forEach(clearInterval);
  }, [finalSections]);

  if (isError) {
    return (
      <View className="px-4 mt-10">
        <Text className="text-white">Error loading shows</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={finalSections}
      keyExtractor={(_, index) => index.toString()}
      ListHeaderComponent={listHeaderComponent}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <EmptyState
          title="No data found"
          description="Refresh or check back later"
          onButtonPress={refetch}
        />
      }
      renderItem={({ item }) => {
        if (isLoading) {
          return <SkeletonRow title={item.title} screenWidth={SCREEN_WIDTH} />;
        }

        const key = item.title;
        const activeIndex = activeIndexes[key] || 0;
        const fadeAnim = getFade(key);

        const empty = isEmpty(item.data);

        return (
          <View className="mt-6">
            {item.title !== "All Shows" && (
              <View className="px-4 flex-row items-center gap-2 mb-2">
                <View>{item.icon}</View>
                <Text
                  variant="medium"
                  className="text-muted-foreground text-lg"
                >
                  {item.title?.toUpperCase()}
                </Text>
              </View>
            )}
            {empty ? (
              <View className="px-4 py-6">
                <EmptyState
                  title={`${item.title} is empty`}
                  description="Nothing available right now"
                  onButtonPress={refetch}
                />
              </View>
            ) : item.title === "Trending Live" ||
              item.title === "Recommended For You" ? (
              <>
                <Animated.View style={{ opacity: fadeAnim }}>
                  {renderLiveItem(item.data[activeIndex], SCREEN_WIDTH)}
                </Animated.View>

                {item.data.length > 1 && (
                  <View className="flex-row justify-center mb-2">
                    {item.data.map((_, i) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => {
                          setActiveIndexes((prev) => ({
                            ...prev,
                            [key]: i,
                          }));
                          setProgressMap((prev) => ({
                            ...prev,
                            [key]: 0,
                          }));
                        }}
                        style={{
                          width: i === activeIndex ? 24 : 8,
                          height: 8,
                          borderRadius: 4,
                          marginHorizontal: 4,
                          backgroundColor:
                            i === activeIndex ? "#ef4444" : "#9ca3af",
                        }}
                      />
                    ))}
                  </View>
                )}
              </>
            ) : item.title === "All Shows" ? (
              <View className="px-4">
                <PosterSectionList
                  header={title}
                  sections={[
                    {
                      title: "",
                      data:
                        guideData?.data?.map((it: any) => ({
                          title: it.program?.title || "Untitled",
                          poster: it.program?.image_url,
                          undefined,
                        })) ?? [],
                    },
                  ]}
                  cardWidth={CARD_WIDTH}
                  cardMargin={CARD_MARGIN}
                  sidePadding={SIDE_PADDING}
                />
              </View>
            ) : (
              <FlatList
                horizontal
                data={item.data}
                keyExtractor={(item, index) =>
                  item.id?.toString() || index.toString()
                }
                renderItem={({ item }) => renderLiveItem(item, SCREEN_WIDTH)}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                snapToInterval={SCREEN_WIDTH}
              />
            )}
          </View>
        );
      }}
    />
  );
}
