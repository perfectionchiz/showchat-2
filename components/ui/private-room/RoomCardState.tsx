import { Button } from "@/components/common/Button";
import { Text } from "@/components/ui/Text";
import { MessageCircle } from "lucide-react-native";
import React from "react";
import { Platform, View } from "react-native";
import EmptyState from "../EmptyState";
import SkeletonText from "../skeleton/SkeletonText";

type Room = {
  name: string;
  description?: string;
  private_room_members?: any[];
};

type Props = {
  isLoading: boolean;
  room: Room | undefined;
  onOpenRoom: () => void;
  onCreateRoom: () => void;
};

export default function RoomCardState({
  isLoading,
  room,
  onOpenRoom,
  onCreateRoom,
}: Props) {
  const memberCount = room?.private_room_members?.length || 0;
  if (!isLoading && !room) {
    return (
      <EmptyState
        icon={<MessageCircle size={40} color={"#95A3B8"} />}
        title="No private room"
        description="You haven't created a private room yet"
      />
    );
  }

  if (isLoading) {
    return (
      <View className="bg-primary border border-gray-800 rounded-2xl p-4">
        <View className="flex-row mb-3">
          <View className="flex-1 ml-3">
            <SkeletonText width={"70%"} height={18} />

            <View className="mt-2">
              <SkeletonText width={"90%"} height={12} />
            </View>

            <View className="flex-row items-center mt-3">
              {[1, 2, 3].map((i) => (
                <View
                  key={i}
                  className="w-6 h-6 rounded-full bg-gray-700 -ml-2 border border-[#0f172a]"
                />
              ))}
            </View>

            <View className="mt-4">
              <SkeletonText width={135} height={36} />
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-primary border border-gray-800 rounded-2xl p-4">
      <View className="flex-row mb-3">
        <View className="w-16 h-16 rounded-xl bg-indigo-600 items-center justify-center mr-3">
          <Text className="text-white text-3xl font-bold">#</Text>
        </View>

        <View className="flex-1">
          <Text variant="semibold" className="text-white text-xl">
            {room?.name}
          </Text>

          <Text className="text-sm text-gray-400">
            {room?.description || "No description available"}
          </Text>

          <View className="flex-row items-center">
            {room?.private_room_members?.slice(0, 3).map((_, i) => (
              <View
                key={i}
                className="w-6 h-6 rounded-full bg-gray-500 -ml-2 border border-[#0f172a]"
              />
            ))}
            {memberCount > 3 && (
              <Text className="text-xs text-gray-400 ml-2">
                +{memberCount - 3}
              </Text>
            )}
          </View>

          <Button
            className="mt-4 w-[12] rounded-2xl"
            textClassName="text-sm"
            size="sm"
            style={{ width: Platform.OS === "web" ? 175 : 135 }}
            onPress={onOpenRoom}
            icon={<MessageCircle size={16} color="#fff" />}
            variant="secondary"
          >
            Open Room
          </Button>
        </View>
      </View>
    </View>
  );
}
