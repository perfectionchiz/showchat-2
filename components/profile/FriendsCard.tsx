import { Text } from "@/components/ui/Text";
import SkeletonText from "@/components/ui/skeleton/SkeletonText";
import { getInitials } from "@/utils/getInitials";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { UserAvatar } from "../chat/UserAvatar";

type Props = {
  loading?: boolean;
  friendList?: any[];
  setOpen: () => void;
};

export const FriendsCard: React.FC<Props> = ({
  loading,
  friendList,
  setOpen,
}) => {
  return (
    <TouchableOpacity
      onPress={setOpen}
      className="bg-primary px-5 py-4 rounded-2xl border border-gray-800 mt-4"
    >
      <View className="flex-row items-center justify-between">
        <Text variant="semibold" className="text-white">
          Friends
        </Text>

        {loading ? (
          <SkeletonText width={120} height={12} />
        ) : friendList && friendList.length > 0 ? (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              setOpen();
            }}
            className="flex-row items-center gap-1"
          >
            <UserAvatar
              profileUrl={friendList[0]?.avatar_url}
              displayName={friendList[0]?.display_name}
              getInitials={getInitials}
              size={32}
            />

            <Ionicons name="chevron-forward" color={"#95A3B8"} size={17} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              setOpen();
            }}
            className="flex-row items-center gap-1"
          >
            <Ionicons name="chevron-forward" color={"#95A3B8"} size={17} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};
