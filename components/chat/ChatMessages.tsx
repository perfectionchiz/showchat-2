import { PRIMARY_COLOR } from "@/constants/constants";
import { useChatMessagesState } from "@/hooks/messages/useChatMessagesState";
import { useMessageReactionsChannel } from "@/hooks/messages/useMessageReactionChannels";
import { useRealtimeMessages } from "@/hooks/messages/useRealTimeMessages";
import { useSurgeAlert } from "@/hooks/messages/useSurgeAlert";
import { FlashList } from "@shopify/flash-list";
import { ArrowDown } from "lucide-react-native";
import React, { forwardRef, useCallback, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Button } from "../common/Button";
import { Text } from "../ui/Text";
import ChatEmptyState from "./ChatEmptyState";
import { ChatHeaderSection } from "./ChatHeaderSection";
import { ChatMessageRenderer } from "./ChatMessageRenderer";
import { EmojiPickerHandle, FullEmojiPicker } from "./EmojiPicker";
import { FirstMessageCelebration } from "./FirstMessageCelebration";
import { TypingUsers } from "./TypingUsers";
export type TypingUser = {
  user_name: string;
  typing: boolean;
};
type Props = {
  roomId: string;
  roomType: "live" | "show" | "private";
  typingUsers: TypingUser[];
  isTyping: boolean;
  showCelebration: boolean;
  setMessageCelebration: (show: boolean) => void;
  sendMessage: () => void;
};

export type ChatMessagesRef = {
  scrollToTop: () => void;
  scrollToBottom: () => void;
};

export const ChatMessages = forwardRef<ChatMessagesRef, Props>(
  (
    {
      roomId,
      roomType,
      typingUsers = [],
      isTyping,
      showCelebration,
      setMessageCelebration,
      sendMessage,
    },
    ref,
  ) => {
    const {
      user,
      pin,
      react,
      remove,
      report,
      activeTitle,
      listRef,
      isPrivate,
      isFetchingNextPage,
      handleEndReached,
      isLoading,
      messages,
      unreadCount,
      scrollToBottom,
      firstUnreadTimestamp,
      viewabilityConfig,
      onViewableItemsChanged,
      showScrollBottom,
      handleScroll,
    } = useChatMessagesState(roomId, roomType);
    const emojiPickerRef = useRef<EmojiPickerHandle>(null);
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
      null,
    );

    useRealtimeMessages(roomId, roomType, user);
    useSurgeAlert(roomId);
    useMessageReactionsChannel(roomId, roomType, user);

    const scrollToMessage = (messageId: string) => {
      const index = messages.findIndex(
        (m) => m.id === messageId || m.server_id === messageId,
      );

      if (index === -1 || !listRef.current) return;

      listRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    };
    const handleOpenPicker = async (emoji: string) => {
      await react.mutateAsync({ emoji, message_id: selectedMessageId || "" });
    };
    const renderItem = useCallback(
      ({ item }: any) => {
        return (
          <ChatMessageRenderer
            item={item}
            isPrivate={isPrivate}
            user={user}
            pin={pin}
            react={react}
            remove={remove}
            report={report}
            onResend={sendMessage}
            setEmojiSheet={(id: string) => {
              setSelectedMessageId(id);
              emojiPickerRef.current?.open();
            }}
          />
        );
      },
      [isPrivate, user, pin, react, remove, report],
    );
    return (
      <View className="flex-1 bg-background ">
        <ChatHeaderSection
          onPin={(id) => {
            pin.mutate(id);
          }}
          onGoToMessage={scrollToMessage}
          messages={messages}
          isPrivate={isPrivate}
          activeTitle={activeTitle}
          isLoading={isLoading}
          roomType={roomType}
          unreadCount={unreadCount}
          firstUnreadTimestamp={firstUnreadTimestamp}
          scrollToBottom={scrollToBottom}
        />

        <FlashList
          maintainVisibleContentPosition={{
            disabled: false,
            autoscrollToTopThreshold: 10,
          }}
          ref={listRef}
          data={messages}
          inverted
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.2}
          onScroll={handleScroll}
          viewabilityConfig={viewabilityConfig}
          contentContainerStyle={{
            paddingTop: 60,
            justifyContent: "flex-end",
            flexGrow: 1,

            paddingHorizontal: 20,
          }}
          onViewableItemsChanged={onViewableItemsChanged}
          ListFooterComponent={() =>
            isFetchingNextPage && (
              <View>
                <ActivityIndicator color={PRIMARY_COLOR} size="small" />
                <Text className="text-gray-500 text-center text-[10px] mt-2 uppercase tracking-tighter">
                  Loading older messages...
                </Text>
              </View>
            )
          }
          ListEmptyComponent={
            isLoading ? null : (
              <View style={{ height: 300 }}>
                <ChatEmptyState chatType={roomType} isLoading={isLoading} />
              </View>
            )
          }
          showsVerticalScrollIndicator={false}
        />
        {showScrollBottom && (
          <View
            style={{
              position: "absolute",
              bottom: 100,
              right: 20,
              zIndex: 999,
            }}
          >
            <Button
              icon={<ArrowDown size={20} color="#fff" />}
              onPress={scrollToBottom}
              className="bg-primary h-9 w-9 border-gray-700 border rounded-full shadow-xl"
            />
          </View>
        )}

        <FullEmojiPicker
          ref={emojiPickerRef}
          onEmojiSelect={handleOpenPicker}
          showTrigger={false}
        />
        <TypingUsers isTyping={isTyping} typingUsers={typingUsers} />
        <FirstMessageCelebration
          show={showCelebration}
          onComplete={() => setMessageCelebration(false)}
        />
      </View>
    );
  },
);

ChatMessages.displayName = "ChatMessages";
