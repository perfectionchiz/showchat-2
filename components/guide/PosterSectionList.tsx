import { Text } from "@/components/ui/Text";
import React from "react";
import { FlatList, View } from "react-native";
import { MockPosterCard } from "../ui/MockPoster";
type PosterItem = {
  title: string;
  poster: string | undefined;
};

type PosterSection = {
  title: string;
  data: PosterItem[];
};

type Props = {
  sections?: PosterSection[];
  cardWidth: number;
  cardMargin: number;
  sidePadding: number;
  header: string;
};

export default function PosterSectionList({
  sections = [],
  cardWidth,
  cardMargin,
  sidePadding,
  header,
}: Props) {
  if (!sections.length) return null;

  return (
    <View className="px-4">
      <Text
        variant="medium"
        className="uppercase mb-3 text-muted-foreground text-lg"
      >
        {header}
      </Text>
      {sections.map((section, index) => {
        if (!section?.data?.length) return null;

        return (
          <View key={section.title + index}>
            <FlatList
              horizontal
              data={section.data}
              keyExtractor={(item, i) => `${item}-${i}`}
              renderItem={({ item }) => (
                <View className="mr-2">
                  <MockPosterCard
                    title={item.title}
                    posterUrl={item?.poster}
                    width={cardWidth}
                  />
                  <Text
                    className="text-xs mt-1 text-white"
                    numberOfLines={1}
                  ></Text>
                </View>
              )}
              showsHorizontalScrollIndicator={false}
              snapToInterval={cardWidth + cardMargin}
              snapToAlignment="start"
              decelerationRate="fast"
              contentContainerStyle={{
                paddingHorizontal: sidePadding,
                paddingBottom: 10,
              }}
            />
          </View>
        );
      })}
    </View>
  );
}
