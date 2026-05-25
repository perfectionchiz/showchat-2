import React from "react";
import { Animated, FlatList, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";
import { useToast } from "../context/ToastContext";
import { LiveCard } from "../live/LiveCard";
import EmptyState from "../ui/EmptyState";
import { Text } from "../ui/Text";
import PosterSectionList from "./PosterSectionList";

const isEmpty = (data?: any[]) => !data || data.length === 0;

export default function SectionRenderer({
  item,
  guideData,
  title,
  SCREEN_WIDTH,
  setRoom,
  activeIndexes,
  setActiveIndexes,
  progressMap,
  setProgressMap,
  fadeAnimMap,
  refetch,
}: any) {
  const key = item.title;
  const GRID_COLUMNS = 3;
  const CARD_MARGIN = 12;
  const SIDE_PADDING = 16;

  const GROUP_WIDTH = SCREEN_WIDTH - SIDE_PADDING * 2;
  const { showToast } = useToast();
  const CARD_WIDTH =
    (GROUP_WIDTH - CARD_MARGIN * (GRID_COLUMNS - 1)) / GRID_COLUMNS;
  const getFade = () => {
    if (!fadeAnimMap.current[key]) {
      fadeAnimMap.current[key] = new Animated.Value(1);
    }
    return fadeAnimMap.current[key];
  };

  const renderLiveItem = (liveItem: any) => (
    <View style={{ width: SCREEN_WIDTH, paddingHorizontal: 12 }}>
      <LiveCard
        variant="guide"
        {...liveItem}
        onPress={() => {
          if (liveItem.isLive) {
            setRoom(liveItem);
            router.push({
              pathname: "/guide/[roomChatId]",
              params: { roomChatId: `${item.title}` },
            });
          } else {
            showToast(`${item.title} is yet to start`, "info");
          }
        }}
      />
    </View>
  );

  const empty = isEmpty(item.data);
  const activeIndex = activeIndexes[key] || 0;
  const fadeAnim = getFade();

  return (
    <View className="mt-2">
      {item.title !== "All Shows" && (
        <View className="px-4 flex-row items-center gap-2 mb-2">
          <View>{item.icon}</View>
          <Text className="text-muted-foreground text-lg">
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
      ) : item.title === "All Shows" ? (
        <View className="px-4">
          <PosterSectionList
            cardWidth={CARD_WIDTH}
            cardMargin={CARD_MARGIN}
            sidePadding={SIDE_PADDING}
            header={title}
            sections={[
              {
                title: "",
                data:
                  guideData?.data?.map((it: any) => ({
                    title: it.program?.title || "Untitled",
                    poster:
                      it.program?.image_url ||
                      it.channel?.logo_url ||
                      undefined,
                  })) ?? [],
              },
            ]}
          />
        </View>
      ) : item.title === "Trending Live" ||
        item.title === "Recommended For You" ? (
        <>
          <Animated.View style={{ opacity: fadeAnim }}>
            {item.data[activeIndex] && renderLiveItem(item.data[activeIndex])}
          </Animated.View>

          {item.data.length > 1 && (
            <View className="flex-row justify-center mb-2">
              {item.data.map((_: any, i: number) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    setActiveIndexes((prev: any) => ({
                      ...prev,
                      [key]: i,
                    }));

                    setProgressMap((prev: any) => ({
                      ...prev,
                      [key]: 0,
                    }));
                  }}
                  style={{
                    width: i === activeIndex ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    marginHorizontal: 4,
                    backgroundColor: i === activeIndex ? "#ef4444" : "#9ca3af",
                  }}
                />
              ))}
            </View>
          )}
        </>
      ) : (
        <FlatList
          horizontal
          data={item.data}
          keyExtractor={(i, index) => i.id?.toString() || index.toString()}
          renderItem={({ item }) => renderLiveItem(item)}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={SCREEN_WIDTH}
        />
      )}
    </View>
  );
}
