import { Button } from "@/components/common/Button";
import { Text } from "@/components/ui/Text";
import React from "react";
import { View } from "react-native";

type Props = {
  leave: () => void;
  isLeavingRoom: boolean;
};

export default function LeaveRoom({ leave, isLeavingRoom }: Props) {
  return (
    <View className="px-4">
      <Text variant="semibold" className="text-red-500 text-lg mb-2">
        Leave Room
      </Text>
      <Text className="text-muted-foreground text-sm mb-4">
        Are you sure you want to leave this room?
      </Text>

      <Button
        isLoading={isLeavingRoom}
        disabled={isLeavingRoom}
        onPress={leave}
        textClassName="text-secondary"
      >
        Confirm
      </Button>
    </View>
  );
}
