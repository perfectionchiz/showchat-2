import { Text } from "@/components/ui/Text";
import SkeletonText from "@/components/ui/skeleton/SkeletonText";
import { formatTime } from "@/utils/formatTime";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

type Props = {
  bio?: string;
  email?: string;
  loading?: boolean;
  createdAt?: string;
};

export const BioCard: React.FC<Props> = ({
  bio,
  email,
  loading,
  createdAt,
}) => {
  return (
    <View className="bg-primary px-5 py-4 rounded-2xl border border-gray-800 mt-4">
      <View>
        <Text variant="semibold" className="text-white mb-3">
          Bio
        </Text>

        {loading ? (
          <View>
            <SkeletonText width={220} height={12} />
            <View className="mt-2">
              <SkeletonText width={180} height={12} />
            </View>
          </View>
        ) : bio ? (
          <Text className="text-muted-foreground">{bio}</Text>
        ) : (
          <Text className="text-muted-foreground">Update your bio...</Text>
        )}

        <Text variant="semibold" className="text-white mt-4 mb-3">
          Member since
        </Text>
        <View className="">
          {loading ? (
            <SkeletonText width={200} height={12} />
          ) : (
            <View className="flex-row items-center gap-2">
              <Ionicons name="calendar" size={14} color="#9ca3af" />
              <Text className=" text-muted-foreground">
                {formatTime(createdAt || "")}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
