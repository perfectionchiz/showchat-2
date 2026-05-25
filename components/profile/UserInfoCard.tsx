import { Text } from "@/components/ui/Text";
import SkeletonText from "@/components/ui/skeleton/SkeletonText";
import { PRIMARY_COLOR } from "@/constants/constants";
import React from "react";
import { View } from "react-native";

type Props = {
  username?: string;
  displayName?: string;
  loading?: boolean;
};

export const UserInfoCard: React.FC<Props> = ({
  username,
  displayName,
  loading,
}) => {
  return (
    <View className="bg-primary px-5 py-4 rounded-2xl border border-gray-800 mt-4">
      <View className="flex-row items-center justify-between">
        <Text variant="semibold" className="text-white mb-3">
          Username
        </Text>

        {loading ? (
          <SkeletonText width={100} height={12} />
        ) : username ? (
          <Text className="text-zinc-300">@{username}</Text>
        ) : (
          <Text style={{ color: PRIMARY_COLOR }}>update your username</Text>
        )}
      </View>

      <View className="flex-row items-center mt-3 justify-between">
        <Text variant="semibold" className="text-white">
          Display Name
        </Text>

        {loading ? (
          <SkeletonText width={120} height={12} />
        ) : displayName ? (
          <Text className="text-zinc-300">{displayName}</Text>
        ) : (
          <Text style={{ color: PRIMARY_COLOR }}>update display name</Text>
        )}
      </View>
    </View>
  );
};
