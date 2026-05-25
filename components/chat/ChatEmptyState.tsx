import { Balloon, Lock, MegaphoneIcon } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

type ChatType = "show" | "private" | "live";

interface ChatEmptyStateProps {
  chatType: ChatType;
  isLoading?: boolean;
}

export default function ChatEmptyState({
  chatType,
  isLoading = false,
}: ChatEmptyStateProps) {
  if (isLoading) {
    return (
      <View
        style={{ height: 300 }}
        className="flex-1 items-center mt-[100px] justify-center py-20"
      >
        <Text className="text-gray-500 text-base">Loading messages...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center py-20 px-10">
      {chatType === "show" ? (
        <>
          <View className="bg-primary w-16 h-16 flex justify-center items-center rounded-full mb-3">
            <MegaphoneIcon size={30} color={"#95A3B8"} />
          </View>
          <Text className="text-2xl font-semibold text-gray-300 text-center mb-2">
            No one has spoken yet
          </Text>
          <Text className="text-base text-muted-foreground text-center leading-relaxed">
            This is a live show.{"\n"}
            Be the first to drop a message 🔥
          </Text>
        </>
      ) : chatType === "live" ? (
        <>
          <View className="bg-primary flex-1 w-16 h-16 flex justify-center items-center rounded-full mb-3">
            <Balloon size={30} color={"#95A3B8"} />
          </View>
          <Text className="text-2xl font-semibold text-gray-300 text-center mb-2">
            Live chat is empty
          </Text>
          <Text className="text-base text-muted-foreground text-center leading-relaxed">
            The live just started.{"\n"}
            Be the first to join the conversation 🎉
          </Text>
        </>
      ) : (
        <>
          <View className="bg-primary w-16 h-16 flex justify-center items-center rounded-full mb-3">
            <Lock size={30} color={"#95A3B8"} />
          </View>
          <Text className="text-2xl font-semibold text-gray-300 text-center mb-2">
            Private chat started
          </Text>
          <Text className="text-base text-muted-foreground text-center leading-relaxed">
            Say hi and break the ice 👋{"\n"}
            Messages here are only visible to members
          </Text>
        </>
      )}
    </View>
  );
}
