import { Button } from "@/components/common/Button";
import { Text } from "@/components/ui/Text";
import { PrivateRoom } from "@/models/private-room.model";
import { UserPlus2 } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

type Props = {
  onInvite: () => void;
  room?: PrivateRoom;
  isInviting: boolean;
};

export default function InviteMembers({ room, isInviting, onInvite }: Props) {
  return (
    <View className="p-5 bg-background  rounded-3xl border border-gray-800  ">
      <View className="items-center mb-6">
        <View className="w-16 h-16  rounded-2xl items-center justify-center mb-4 border border-gray-800">
          <UserPlus2 size={28} color="#818cf8" />
        </View>

        <Text variant="bold" className="text-white text-xl text-center">
          Invite Members
        </Text>

        <Text className="text-gray-400 text-sm text-center mt-1 px-4">
          Share a link to add people to{" "}
          <Text className="text-indigo-400 font-medium">
            {room?.name || "this room"}
          </Text>
        </Text>
      </View>

      <View className="gap-y-3">
        <Button
          disabled={isInviting}
          isLoading={isInviting}
          variant="secondary"
          className="rounded-2xl"
          onPress={onInvite}
        >
          Generate Invite Link
        </Button>

        <Text className="text-[10px] text-gray-500 text-center uppercase tracking-widest">
          Links expire after 24 hours
        </Text>
      </View>
    </View>
  );
}
