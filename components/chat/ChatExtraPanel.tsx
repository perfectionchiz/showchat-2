import { PRIMARY_COLOR } from "@/constants/constants";
import { Image } from "expo-image";
import React, { ReactNode, useEffect } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import DebouncedSearchInput from "../forms/SearchInput";
import InfiniteList from "../ui/InfiniteList";
import { Text } from "../ui/Text";

type TabType = "stickers" | "reactions";

interface ChatExtraPanelProps {
  onReaction: (emoji: string) => void;
  onStickerSelect: (url: string) => void;
  stickerData: any;
  isLoadingStickers: boolean;
  fetchNextStickers: () => void;
  hasNextStickersPage: boolean | undefined;
  isFetchingNextStickers: boolean;
  onRefreshStickers: () => void;
  setSearchQuery: (query: string) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  children?: ReactNode;
}
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const REACTIONS = ["❤️", "😂", "😮", "😢", "👍", "🔥", "👏", "🎉"];

export const ChatExtraPanel = ({
  onReaction,
  onStickerSelect,
  stickerData,
  isLoadingStickers,
  fetchNextStickers,
  hasNextStickersPage,
  isFetchingNextStickers,
  onRefreshStickers,
  setSearchQuery,
  activeTab,
  setActiveTab,
}: ChatExtraPanelProps) => {
  const contentOffset = useSharedValue(0);

  useEffect(() => {
    contentOffset.value = withTiming(
      activeTab === "stickers" ? 0 : -SCREEN_WIDTH,
      {
        duration: 250,
        easing: Easing.out(Easing.quad),
      },
    );
  }, [activeTab]);

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: contentOffset.value }],
  }));

  const renderSticker = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => onStickerSelect(item.url)}
      className="mb-2 items-center justify-center"
      style={{ width: SCREEN_WIDTH / 5 }}
    >
      <View className="bg-white/5 rounded-xl p-1">
        <Image
          source={{ uri: item.url }}
          style={{ width: 60, height: 60 }}
          contentFit="contain"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={{ height: 360, marginTop: -15 }}
      className="bg-[#0f172a] border-t border-white/10 "
    >
      <View className="flex-row justify-center py-3">
        <View className="flex-row bg-black/30 rounded-lg p-1 border border-white/5">
          {(["stickers", "reactions"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                backgroundColor:
                  activeTab === tab ? PRIMARY_COLOR : "transparent",
              }}
              className={`px-6 py-1 rounded-lg `}
            >
              <Text
                className={`text-sm font-bold uppercase ${activeTab === tab ? "text-white" : "text-gray-400"}`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Animated.View
        style={[
          { flexDirection: "row", width: SCREEN_WIDTH * 2, flex: 1 },
          animatedContentStyle,
        ]}
      >
        <View style={{ width: SCREEN_WIDTH }}>
          <View className="px-2 pb-2">
            <DebouncedSearchInput
              onSearch={setSearchQuery}
              placeholder="Search for premium stickers..."
            />
          </View>
          <InfiniteList
            data={stickerData}
            renderItem={renderSticker}
            keyExtractor={(item: any) => item.id}
            numColumns={5}
            isLoading={isLoadingStickers}
            fetchNextPage={fetchNextStickers}
            hasNextPage={hasNextStickersPage}
            isFetchingNextPage={isFetchingNextStickers}
            onRefresh={onRefreshStickers}
            skeletonCount={5}
            contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 8 }}
          />
        </View>
        <View style={{ width: SCREEN_WIDTH, paddingHorizontal: 20 }}>
          <View className="flex-row flex-wrap justify-center gap-2 pt-2">
            {REACTIONS.map((emoji, i) => (
              <Animated.View
                key={i}
                entering={FadeInDown.delay(i * 30)
                  .springify()
                  .damping(12)}
                style={{ width: 60 }}
              >
                <TouchableOpacity
                  onPress={() => onReaction?.(emoji)}
                  activeOpacity={0.7}
                  className="items-center justify-center"
                >
                  <View
                    className="bg-white/20 w-14 h-14 rounded-2xl items-center justify-center border border-white/10"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 5,
                      elevation: 3,
                    }}
                  >
                    <Text style={{ fontSize: 26 }}>{emoji}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
          <View className="flex-row items-center gap-x-2 justify-center mt-5">
            <Text className="text-center text-gray-300">
              Add Quick reaction
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};
