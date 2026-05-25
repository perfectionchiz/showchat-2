import { Button } from "@/components/common/Button";
import { Text } from "@/components/ui/Text";
import React from "react";
import { View } from "react-native";

type Props = {
  deleteRoom: () => void;
  isDeletingRoom: boolean;
};

export default function DeleteRoom({ deleteRoom, isDeletingRoom }: Props) {
  return (
    <View className="px-4">
      <Text variant="semibold" className=" text-lg  mb-2">
        Delete Room
      </Text>
      <Text className="text-muted-foreground text-sm mb-4">
        Are you sure you want to delete this room? Note:(this is ireversible)
      </Text>

      <Button
        isLoading={isDeletingRoom}
        disabled={isDeletingRoom}
        onPress={deleteRoom}
        textClassName="text-secondary"
      >
        Continue anyways
      </Button>
    </View>
  );
}
