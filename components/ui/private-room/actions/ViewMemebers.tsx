import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/ui/Text";
import { PrivateRoom } from "@/models/private-room.model";
import { Trash2, Users2 } from "lucide-react-native";
import React from "react";
import { FlatList, View } from "react-native";
import EmptyState from "../../EmptyState";

type Props = {
  room: PrivateRoom;
  onClose: () => void;
  isOwner: boolean;
  onRemoveMember?: (userId: string) => void;
  isRemovingMember: boolean;
};

export default function ViewMembers({
  room,
  onClose,
  isOwner,
  onRemoveMember,
  isRemovingMember,
}: Props) {
  const members = room?.private_room_members;

  const isEmpty = members.length === 0;

  return (
    <View className=" px-4 pt-2">
      <View className="border-b border-gray-800 mb-4">
        <Text
          variant="semibold"
          className="text-white text-xl font-semibold mb-1"
        >
          Members
        </Text>
        <Text className="text-muted-foreground text-sm mb-4">
          {members.length}
          {members.length === 1 ? "  Member" : "  Members"} in{" "}
          {room.name || "this room"}
        </Text>
      </View>

      {isEmpty ? (
        <EmptyState
          icon={<Users2 size={30} color={"#95A3B8"} />}
          title="No members yet"
          description="Be the first to invite people to this room"
        />
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.user_id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View className="flex-row items-center gap-2 border p-5 border-gray-800 rounded-2xl mb-3">
              <Avatar name={item.profiles.display_name} />

              <View className="flex-1">
                <Text className="text-white font-medium">
                  {item.profiles.display_name}
                </Text>
                <Text className="text-muted-foreground text-xs">
                  Joined {new Date(item.joined_at).toDateString()}
                </Text>
              </View>

              {item.user_id === room.owner_id && (
                <View className="bg-primary px-2 py-1 rounded-full">
                  <Text className="text-xs text-white">Owner</Text>
                </View>
              )}

              {isOwner && item.user_id !== room.owner_id && (
                <Button
                  isLoading={isRemovingMember}
                  disabled={isRemovingMember}
                  textClassName="text-sm"
                  icon={<Trash2 size={18} color="#f44034" />}
                  onPress={() => onRemoveMember?.(item.user_id)}
                  className="ml-2 p-2"
                >
                  Remove
                </Button>
              )}
            </View>
          )}
        />
      )}

      <Button
        textClassName="text-secondary"
        isLoading={false}
        onPress={onClose}
      >
        Close
      </Button>
    </View>
  );
}
