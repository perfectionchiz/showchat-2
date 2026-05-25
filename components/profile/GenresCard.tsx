import SkeletonText from "@/components/ui/skeleton/SkeletonText";
import { Text } from "@/components/ui/Text";
import React from "react";
import { View } from "react-native";

type Props = {
  genres?: string[];
  loading?: boolean;
};

export const GenresCard: React.FC<Props> = ({ genres, loading }) => {
  return (
    <View className="bg-primary px-5 py-4 rounded-2xl border border-gray-800 mt-4">
      <View>
        <Text variant="semibold" className="text-white mb-3">
          Favorite Genres
        </Text>

        {loading ? (
          <View className="flex-row flex-wrap gap-2">
            <SkeletonText width={70} height={28} />
            <SkeletonText width={70} height={28} />
            <SkeletonText width={70} height={28} />
          </View>
        ) : genres?.length ? (
          <View className="flex-row flex-wrap gap-2">
            {genres.map((genre) => (
              <View
                key={genre}
                className="rounded-full px-4 py-2 border border-gray-800"
              >
                <Text className="text-xs capitalize ">
                  {genre.replace("_", "-")}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-muted-foreground mt-3">
            No favourite genres selected yet...
          </Text>
        )}
      </View>
    </View>
  );
};
