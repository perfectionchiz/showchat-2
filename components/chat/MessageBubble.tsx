import { isStickerMessage } from "@/utils/isStickerImage";
import { Image } from "expo-image";
import { RotateCcw } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import Animated from "react-native-reanimated";
import { Text } from "../ui/Text";

interface Props {
  animatedStyle: any;
  isOwnMessage: boolean;
  image?: string;
  message: string;
  isHighLight: boolean;
  isPending?: boolean;
  isFailed?: boolean;
  onResend?: () => void;
}

export const MessageBubble: React.FC<Props> = ({
  animatedStyle,
  isOwnMessage,
  image,
  message,
  isHighLight,
  isPending,
  onResend,
  isFailed,
}) => {
  const isSticker = isStickerMessage(message);

  return (
    <Animated.View style={animatedStyle}>
      {isSticker ? (
        <View className="relative mt-1">
          <Image
            source={{ uri: message }}
            style={{ width: 70, height: 70 }}
            contentFit="contain"
            cachePolicy="memory-disk"
          />

          <View className="flex-row items-center mt-1 gap-x-2">
            {isOwnMessage && isPending && (
              <Text className="text-[10px] text-muted-foreground italic">
                Sending sticker...
              </Text>
            )}
            {isOwnMessage && isFailed && (
              <Pressable
                onPress={onResend}
                className="flex-row items-center gap-1 bg-black/40 px-2 py-1 rounded-full"
              >
                <RotateCcw size={12} color="#ef4444" />
                <Text className="text-[10px] text-red-500 font-bold">
                  Retry
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      ) : (
        <View>
          {isHighLight ? (
            <View
              className={`relative px-3 py-3 mt-1 self-end rounded-2xl ${
                isOwnMessage
                  ? "bg-secondary rounded-tr-sm"
                  : "bg-[#20284c] rounded-tl-sm"
              }`}
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: 192, height: 192 }}
                  className="rounded-xl"
                  contentFit="cover"
                />
              ) : (
                <View>
                  <Text className="text-white break-words">{message}</Text>
                </View>
              )}
            </View>
          ) : (
            <View className="relative mt-1">
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: 192, height: 192 }}
                  className="rounded-xl"
                  contentFit="cover"
                />
              ) : (
                <View className="flex-row gap-x-2 items-center">
                  <Text className="text-gray-200 break-words">{message}</Text>

                  {isOwnMessage && isPending && (
                    <Text className="text-xs text-muted-foreground mt-1">
                      sending....
                    </Text>
                  )}

                  {isOwnMessage && isFailed && (
                    <Pressable
                      onPress={() => onResend?.()}
                      className="flex-row items-center gap-1"
                    >
                      <RotateCcw size={14} color="#ef4444" />
                      <Text className="text-xs text-red-500">
                        Tap to resend
                      </Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </Animated.View>
  );
};
