import { User } from "@/models/auth.model";
import React from "react";
import { View } from "react-native";
import { Text } from "../ui/Text";
import { ChatMessage } from "./ChatMessage";
interface ChatRendererProps {
  item: any;
  isPrivate: boolean;
  user: User | null;
  pin: any;
  react: any;
  remove: any;
  report: any;
  setEmojiSheet: (id: string) => void;
  onResend?: () => void;
}
export const ChatMessageRenderer = ({
  item,
  isPrivate,
  user,
  pin,
  react,
  remove,
  report,
  setEmojiSheet,
  onResend,
}: ChatRendererProps) => {
  if (item.type === "header") {
    return (
      <View className="items-center my-3 ">
        <View className="flex-row gap-x-2 items-center">
          <View style={{ height: 1 }} className="bg-gray-800 flex-1" />
          <Text className="text-[10px] text-white uppercase">{item.title}</Text>
          <View style={{ height: 1 }} className="bg-gray-800 flex-1" />
        </View>
      </View>
    );
  }

  return (
    <ChatMessage
      user={user}
      setShowEmojiSheet={() => setEmojiSheet(item.id || item.server_id)}
      isPremium={item?.is_premium || false}
      level={item?.gamification_level ?? 1}
      isPending={item.status === "sending"}
      id={item.id}
      displayName={item.display_name}
      message={item.message}
      profileUrl={item.avatar_url}
      createdAt={item.created_at}
      isFailed={item.status === "failed"}
      onResend={onResend}
      isPinned={item.is_pinned}
      isOwnMessage={item.user_id === user?.id}
      reactions={item.reactions}
      onPin={isPrivate ? () => pin.mutate(item.id) : undefined}
      onReact={(message_id, emoji) => react.mutate({ message_id, emoji })}
      onDelete={() => remove.mutate(item.id)}
      onReport={() => report.mutate(item.id)}
    />
  );
};
