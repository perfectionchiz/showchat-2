import { VIBES } from "@/utils/ambientActivity";
import { formatViewers } from "@/utils/formatViewer";
import { MessageCircleMore } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { Text } from "../ui/Text";

interface Props {
  reactions?: { emoji: string }[];
  viewers?: number;

}

export function LiveCardReactions({ reactions = [], viewers = 0 }: Props) {
  return (
    <View className="flex-row mt-1">
      {reactions.length > 0 && (
        <View className="flex-row items-center mr-2">
          {VIBES.slice(0, 2).map((r, i) => (
            <Text key={i} className="text-lg mr-1">
              {r.emoji}
            </Text>
          ))}
        </View>
      )}

      <View className="flex-row items-center">
        <MessageCircleMore size={20} color="#f44034" />
        <Text className="text-muted-foreground ml-2">
          {formatViewers(viewers)} chatting
        </Text>
      </View>
    </View>
  );
}
