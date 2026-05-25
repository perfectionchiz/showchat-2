import {
  Keyboard as KeyboardIcon,
  Send,
  Smile,
  Sticker,
} from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeOutDown,
} from "react-native-reanimated";

import { PRIMARY_COLOR } from "@/constants/constants";
import { useChatSend } from "@/hooks/messages/useChatSend";
import { useAuthStore } from "@/store/authStore";
import { Button } from "../common/Button";
import { IconButton } from "../common/IconButton";
import { ChatExtraPanel } from "./ChatExtraPanel";
import { FloatingEmoji } from "./FloatingEmoji";

const REACTIONS = ["❤️", "😂", "😮", "😢", "👍", "🔥", "👏", "🎉"];
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ChatFooterData {
  messageInput: string;
  setMessageInput: (message: string) => void;
  handleSendMessage: () => void;
  onReaction?: (emoji: string) => void;
  onStickerSend?: (url: string) => void;
  startTyping?: () => void;
  isPremium?: boolean;
  roomId: string;
}

export const ChatFooter = ({
  messageInput,
  setMessageInput,
  handleSendMessage,
  onReaction,
  onStickerSend,
  startTyping,
  isPremium = false,
  roomId,
}: ChatFooterData) => {
  const { user } = useAuthStore();
  const {
    mode,
    showExtras,
    setShowExtras,
    activeTab,
    setActiveTab,
    setSearchQuery,
    flyingEmojis,
    stickers,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    toggleExtras,
    onFocus,
    onBlur,
    handleReactionInternal,
    removeFlyingEmoji,
    toggleMode,
    iconsStyle,
    inputSlideStyle,
    emojiSlideStyle,
  } = useChatSend({ onReaction, user, roomId });

  const handleInputChange = (text: string) => {
    if (containsLink(text)) return;

    setMessageInput(text);

    if (text.length > 0) {
      startTyping?.();
    }
  };
  const containsLink = (text: string) => /(https?:\/\/|www\.)\S+/i.test(text);
  return (
    <View className="z-50">
      {showExtras && (
        <Pressable
          onPress={() => setShowExtras(false)}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: SCREEN_HEIGHT,
            backgroundColor: "transparent",
          }}
        />
      )}

      <View className="bg-primary border-t border-gray-800">
        <View className="px-4 pb-8 pt-3 flex-row items-center">
          <View className="bg-background border border-gray-800 rounded-full px-4 py-2 flex-row items-center flex-1">
            <Animated.View style={[iconsStyle, { overflow: "hidden" }]}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {isPremium ? (
                  <IconButton
                    style={{ backgroundColor: "#8a5cf61a" }}
                    onPress={toggleExtras}
                    className="rounded-full p-2 "
                    icon={
                      showExtras ? (
                        <KeyboardIcon size={22} color="#fff" />
                      ) : (
                        <Sticker size={22} color="#d1d5db" />
                      )
                    }
                  />
                ) : (
                  <>
                    <IconButton
                      onPress={toggleMode}
                      style={{
                        backgroundColor:
                          mode === "emoji" ? "#8a5cf647" : "#8a5cf61a",
                      }}
                      className={`rounded-full  p-2`}
                      icon={
                        <Smile
                          size={22}
                          color={mode === "emoji" ? "#fff" : "#d1d5db"}
                        />
                      }
                    />
                  </>
                )}
              </View>
            </Animated.View>

            <View className="h-10 flex-1 overflow-hidden relative">
              <Animated.View
                style={[
                  inputSlideStyle,
                  { flex: 1, flexDirection: "row", alignItems: "center" },
                ]}
              >
                <TextInput
                  value={messageInput}
                  onChangeText={handleInputChange}
                  placeholder="Say something..."
                  placeholderTextColor="#94a3b8"
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onPressIn={() => setShowExtras(false)}
                  onSubmitEditing={handleSendMessage}
                  style={{ outlineStyle: "none" } as any}
                  className="flex-1 py-1 text-white px-2 focus:outline-none"
                />
                <Button
                  onPress={handleSendMessage}
                  disabled={!messageInput.trim()}
                  style={{ backgroundColor: PRIMARY_COLOR }}
                  className="rounded-full h-8 w-8"
                  icon={<Send size={14} color="white" />}
                />
              </Animated.View>

              {!isPremium && (
                <Animated.View style={emojiSlideStyle}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    {REACTIONS.map((emoji, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleReactionInternal(emoji)}
                        className="mr-4"
                      >
                        <Text style={{ fontSize: 24 }}>{emoji}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </Animated.View>
              )}
            </View>
          </View>
        </View>

        {isPremium && showExtras && (
          <Animated.View
            entering={FadeInDown.duration(300).easing(Easing.out(Easing.quad))}
            exiting={FadeOutDown.duration(200)}
          >
            <ChatExtraPanel
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onReaction={(emoji) => handleReactionInternal(emoji)}
              onStickerSelect={(url: string) => onStickerSend?.(url)}
              setSearchQuery={setSearchQuery}
              stickerData={stickers}
              isLoadingStickers={isLoading}
              fetchNextStickers={fetchNextPage}
              hasNextStickersPage={!!hasNextPage}
              isFetchingNextStickers={isFetchingNextPage}
              onRefreshStickers={refetch}
            />
          </Animated.View>
        )}

        <View
          style={{
            position: "absolute",
            bottom: 100,
            left: 0,
            right: 0,
            top: 0,
            pointerEvents: "none",
            zIndex: 60,
          }}
        >
          {flyingEmojis.map((item) => (
            <FloatingEmoji
              isMe={item.isMe}
              user={item.user}
              key={item.id}
              emoji={item.emoji}
              onEnd={() => removeFlyingEmoji(item.id)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};
