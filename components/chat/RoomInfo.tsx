import { View } from "react-native";
import { Avatar } from "../common/Avatar";
import { Text } from "../ui/Text";

type PresenceUser = {
  user_id?: string;
  display_name?: string;
  avatar_url?: string;
};

export const RoomInfo = ({
  participantAvatars,
}: {
  participantAvatars: PresenceUser[];
}) => {
  const maxAvatars = 3;

  const uniqueUsers = Array.from(
    new Map((participantAvatars || []).map((u) => [u.user_id, u])).values(),
  );

  const total = uniqueUsers.length;

  return (
    <View className="flex-row items-center ml-1 py-1 rounded-xl">
      <View className="flex-row -space-x-2">
        {uniqueUsers.slice(0, maxAvatars).map((user) => (
          <Avatar
            key={user.user_id}
            size={20}
            uri={user.avatar_url}
            name={user.display_name || "User"}
            className="-ml-2"
          />
        ))}

        {total > maxAvatars && (
          <View className="w-6 h-6 -ml-2 rounded-full border-2 border-[#1a1f2a] bg-gray-700 flex items-center justify-center">
            <Text variant="medium" className="text-white text-xs">
              +{total - maxAvatars}
            </Text>
          </View>
        )}
      </View>

      <Text variant="medium" className="text-gray-200 ml-1">
        {total} {total === 1 ? "person" : "people"} in room
      </Text>
    </View>
  );
};
