import { BlurView } from "expo-blur";
import { Flag, Pin, PlusCircleIcon, Trash2 } from "lucide-react-native";
import React from "react";
import { Modal, Pressable, TouchableWithoutFeedback, View } from "react-native";
import Animated from "react-native-reanimated";
import { Text } from "../ui/Text";
import { MessageBubble } from "./MessageBubble";

interface MessageActionsProps {
  showActions: boolean;
  onClose: () => void;
  canReact: boolean;
  REACTION_EMOJIS: readonly string[];
  onReact: (messageId: string, emoji: string, toggledOff: boolean) => void;

  openEmojiSheet: () => void;
  onPin?: (id: string) => void;
  onReport?: (id: string) => void;
  setShowAction: (action: boolean) => void;
  onDelete?: (id: string) => void;
  confirmDelete: () => void;
  isOwnMessage: boolean;
  isPinned?: boolean;
  id: string;
  animatedBubbleStyle: any;
  message: string;
  image?: string;
  handlePress: () => void;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  showActions,
  canReact,
  REACTION_EMOJIS,
  onReact,
  openEmojiSheet,
  onPin,
  onReport,
  isOwnMessage,
  isPinned,
  id,
  animatedBubbleStyle,
  message,
  image,
  confirmDelete,
  setShowAction,
  handlePress,
}) => {
  return (
    <Modal
      visible={showActions}
      transparent
      animationType="fade"
      onRequestClose={() => setShowAction(false)}
    >
      <TouchableWithoutFeedback onPress={handlePress}>
        <BlurView
          intensity={40}
          tint="dark"
          className="flex-1 items-center justify-center px-6"
        >
          {canReact && (
            <View
              style={{ width: 350 }}
              className="bg-gray-800/80 rounded-full py-2 px-6 mb-3 self-end"
            >
              <View className="flex-row justify-around items-center">
                {REACTION_EMOJIS.map((emoji) => (
                  <Pressable
                    key={emoji}
                    onPress={() => onReact(id, emoji, false)}
                    className="p-2"
                  >
                    <Text className="text-2xl">{emoji}</Text>
                  </Pressable>
                ))}

                <Pressable onPress={openEmojiSheet}>
                  <PlusCircleIcon size={18} color={"#fff"} />
                </Pressable>
              </View>
            </View>
          )}

          <View className="self-end">
            <MessageBubble
              isHighLight={true}
              message={message}
              image={image}
              isOwnMessage={isOwnMessage}
              animatedStyle={animatedBubbleStyle}
            />
          </View>
          <Animated.View
            style={{
              transform: [{ scale: showActions ? 1 : 0.9 }],
              opacity: showActions ? 1 : 0.5,
            }}
            className="bg-primary border mt-2 border-gray-800 rounded-2xl p-3 self-end"
          >
            <View className="flex-col">
              {onPin && isOwnMessage && (
                <Pressable
                  onPress={() => {
                    onPin(id);
                    setShowAction(false);
                  }}
                  className="flex-row items-center p-3 border-gray-800 active:bg-gray-800 rounded-lg"
                >
                  <Pin size={20} color="#eab308" />
                  <Text className="text-white ml-3">
                    {isPinned ? "Unpin" : "Pin"}
                  </Text>
                </Pressable>
              )}

              {onReport && !isOwnMessage && (
                <Pressable
                  onPress={() => {
                    onReport(id);
                    setShowAction(false);
                  }}
                  className="flex-row items-center p-3 border-gray-800 active:bg-gray-800 rounded-lg"
                >
                  <Flag size={20} color="#f59e0b" />
                  <Text className="text-white ml-3">Report</Text>
                </Pressable>
              )}

              {isOwnMessage && (
                <Pressable
                  onPress={confirmDelete}
                  className="flex-row items-center p-3 active:bg-gray-800 rounded-lg"
                >
                  <Trash2 size={20} color="#ef4444" />
                  <Text className="text-red-500 ml-3">Delete</Text>
                </Pressable>
              )}
            </View>
          </Animated.View>
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
