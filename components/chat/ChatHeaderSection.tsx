import { PRIMARY_COLOR } from "@/constants/constants";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "../ui/Text";
import { ChatRules } from "./ChatRules";
import { NewMessagesPopup } from "./NewMessagesPopUp";
import { PinnedMessageBar } from "./PinnedMessageBar";
type ChatHeaderSectionProps = {
  messages: any[];
  isPrivate: boolean;
  activeTitle: string;
  isLoading: boolean;
  roomType: "live" | "show" | "private";
  unreadCount: number;
  firstUnreadTimestamp: string | null;
  scrollToBottom: () => void;
  onPin: (message_id: string) => void;
  onGoToMessage: (id: string) => void;
};

export const ChatHeaderSection = ({
  messages,
  isLoading,
  roomType,
  unreadCount,
  firstUnreadTimestamp,
  onPin,
  scrollToBottom,
  onGoToMessage,
}: ChatHeaderSectionProps) => {
  const [showRules, setShowRules] = useState(true);

  return (
    <>
      <View>
        {messages.find((m) => m.is_pinned) && (
          <PinnedMessageBar
            isPrivate={roomType === "private"}
            message={messages.find((m) => m.is_pinned)}
            onUnpin={onPin}
            onGoToMessage={onGoToMessage}
          />
        )}
        <View className="my-1 px-4">
          {isLoading ? (
            <View>
              <ActivityIndicator color={PRIMARY_COLOR} size="small" />
              <Text className="text-gray-500 text-center text-[10px] mt-2 uppercase tracking-tighter">
                Loading messages...
              </Text>
            </View>
          ) : (
            showRules && <ChatRules roomType={roomType} />
          )}
        </View>
      </View>

      <NewMessagesPopup
        count={unreadCount}
        firstTimestamp={firstUnreadTimestamp}
        onPress={scrollToBottom}
      />
    </>
  );
};
