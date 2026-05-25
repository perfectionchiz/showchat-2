import React from "react";
import { FlatList, View } from "react-native";
import SkeletonText from "../ui/skeleton/SkeletonText";

type Props = {
  title: string;
  screenWidth: number;
};

export default function SkeletonRow({ title, screenWidth }: Props) {
  return (
    <View className="mt-2">
      {title !== "All Shows" && (
        <View className="px-4 flex-row items-center gap-2 mb-2">
          <SkeletonText width={18} height={18} />
          <SkeletonText width={120} height={16} />
        </View>
      )}

      <FlatList
        horizontal
        data={Array.from({ length: 2 })}
        keyExtractor={(_, i) => i.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={() => (
          <View style={{ width: screenWidth, paddingHorizontal: 12 }}>
            <SkeletonText height={140} />
          </View>
        )}
      />
    </View>
  );
}
