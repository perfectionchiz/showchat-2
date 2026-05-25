import { User } from "@/models/auth.model";
import { formatTime } from "@/utils/formatTime";
import { getColorFromName, getGradientFromName } from "@/utils/getInitials";
import { LinearGradient } from "expo-linear-gradient";
import { Pin, SmilePlus } from "lucide-react-native";
import React, { ReactNode } from "react";
import { Platform, Pressable, View } from "react-native";
import { GradientText } from "../common/GradientText";
import { Text } from "../ui/Text";
import { LevelBadge } from "./LevelBadge";
import { MessageBubble } from "./MessageBubble";
import { UserAvatar } from "./UserAvatar";

type Reaction = {
  emoji: string;
  count: number;
  user_ids: string[];
};

type Props = {
  profileUrl?: string;
  displayName: string;
  isOwnMessage: boolean;
  isPinned?: boolean;
  createdDate: Date;
  message: string;
  image?: string;
  animatedBubbleStyle: any;
  isPending: boolean;
  reactions: Reaction[];
  canReact?: boolean;
  onReact?: (id: string, emoji: string, toggledOff: boolean) => void;
  id: string;
  getInitials: (name: string) => string;
  handleLongPress: () => void;
  handlePress: () => void;
  isGrouped: boolean;
  children: ReactNode;
  level: number;
  isPremium: boolean;
  user: User | null;
  setEmojiSheet: (id: string) => void;
  isFailed?: boolean;
  onResend?: () => void;
};

export const MessageContent: React.FC<Props> = ({
  profileUrl,
  displayName,
  isOwnMessage,
  isPinned,
  createdDate,
  message,
  image,
  animatedBubbleStyle,
  isPending,
  reactions,
  setEmojiSheet,
  onReact,
  handleLongPress,
  handlePress,
  isGrouped,
  id,
  children,
  getInitials,
  level,
  isPremium,
  isFailed,
  onResend,
  user,
}) => {
  const safeReactions = Array.isArray(reactions) ? reactions : [];

  return (
    <Pressable
      onLongPress={handleLongPress}
      delayLongPress={200}
      onPress={handlePress}
      className={`flex-row gap-x-2 ${
        isOwnMessage ? "py-2" : ""
      } ${isGrouped ? "mt-2" : "mb-2 mt-3"} relative`}
    >
      {isOwnMessage && (
        <LinearGradient
          colors={["rgba(99, 102, 241, 0.12)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 0 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            paddingVertical: 10,
          }}
        />
      )}

      {isOwnMessage && (
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 2,
            bottom: 2,
            width: 3,
            backgroundColor: "#818cf8",
            borderRadius: 4,
            shadowColor: "#6366f1",
            shadowOffset: { width: 1, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 4,
            elevation: 8,
          }}
        />
      )}

      <View>{children}</View>

      <View className={isOwnMessage ? "ml-1" : ""}>
        <UserAvatar
          isPremium={isPremium}
          profileUrl={profileUrl}
          displayName={displayName}
          getInitials={getInitials}
          size={32}
        />
      </View>

      <View className="flex-1 mt-1">
        <View className="flex-row items-center gap-2">
          {isPinned && (
            <View
              className=" border border-gray-500  px-1.5 py-0.5 rounded-lg flex-row items-center"
              style={{
                shadowColor: "#f59e0b",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 5,
              }}
            >
              <Pin
                size={10}
                color="#fbbf24"
                fill="#fbbf24"
                style={{ transform: [{ rotate: "45deg" }] }}
              />
              <Text className="text-[10px] text-amber-400 font-bold ml-1 uppercase tracking-wider">
                Pinned
              </Text>
            </View>
          )}
          {Platform.OS === "ios" ? (
            <GradientText
              numberOfLines={1}
              colors={
                isOwnMessage
                  ? ["#a5b4fc", "#818cf8"]
                  : getGradientFromName(displayName)
              }
              textVariant={isOwnMessage ? "semibold" : "medium"}
              className="flex-shrink"
            >
              {displayName}
            </GradientText>
          ) : (
            <Text
              numberOfLines={1}
              style={{
                color: isOwnMessage ? "#a5b4fc" : getColorFromName(displayName),
                fontWeight: isOwnMessage ? "900" : "700",
              }}
              variant="medium"
              className="flex-shrink"
            >
              {displayName}
            </Text>
          )}

          {level !== 0 && <LevelBadge level={level} />}

          <Text className="text-gray-500 text-[10px] pr-2">
            {formatTime(createdDate)}
          </Text>
        </View>

        <MessageBubble
          isPending={isPending}
          isHighLight={false}
          message={message}
          image={image}
          isFailed={isFailed}
          onResend={onResend}
          isOwnMessage={isOwnMessage}
          animatedStyle={animatedBubbleStyle}
        />
        <View className="flex-row flex-wrap gap-1.5 mt-1.5">
          {safeReactions.map((r) => {
            const hasReacted = r.user_ids?.includes(user?.id || "");

            return (
              <Pressable
                key={r.emoji}
                onPress={() => {
                  onReact?.(id, r.emoji, !!hasReacted);
                }}
                style={{
                  backgroundColor: hasReacted
                    ? "rgba(99, 102, 241, 0.2)"
                    : "#1f2937",
                  borderColor: hasReacted ? "#6366f1" : "transparent",
                  borderWidth: 1,
                }}
                className="flex-row items-center gap-1.5 px-1.5 py-1 rounded-lg"
              >
                <Text className="text-sm">{r.emoji}</Text>

                {r.count > 0 && (
                  <Text
                    style={{ color: hasReacted ? "#a5b4fc" : "#d1d5db" }}
                    className="text-[11px] font-bold"
                  >
                    {r.count}
                  </Text>
                )}
              </Pressable>
            );
          })}

          {safeReactions.length > 0 && (
            <Pressable
              onPress={() => setEmojiSheet(id)}
              className="flex-row items-center px-1.5 py-1 rounded-lg bg-gray-800 border border-gray-700"
            >
              <SmilePlus size={16} color={"#94a3b8"} />
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
};
