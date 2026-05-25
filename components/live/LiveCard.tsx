import { PRIMARY_COLOR } from "@/constants/constants";
import { formatISO } from "@/utils/formatTime";
import { formatEndsIn } from "@/utils/formatViewer";
import { Eye, MessageCircle, Verified } from "lucide-react-native";
import React from "react";
import {
  ImageBackground,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedAvatar } from "../common/AnimatedAvatar";
import { Button } from "../common/Button";
import { AnimatedEmojis } from "../ui/AnimatedEmoji";
import FallbackImage from "../ui/FallbackImage";
import { Text } from "../ui/Text";
import ChannelCard from "./ChannelCard";
import { LiveBadge } from "./LiveBadge";
import { LiveCompactCard } from "./LiveCompactCard";

interface LiveCardProps {
  variant?: "compact" | "detailed" | "show" | "guide";
  bgVariant?: "header" | "full" | "none";
  avatarUrl?: string;
  channelName?: string;
  channelLogo?: string;
  channelVerified?: boolean;
  showType?: string;
  year?: string;
  title?: string;
  showTitle?: string;
  description?: string;
  viewers?: number;
  viewersDelta?: string;
  votes?: number;
  reactions?: { emoji: string; count: number }[];
  emojis?: string;
  banner?: string;
  extraReactionsCount?: number;
  participantAvatars?: { user_id: string; display_name: string }[];
  extraParticipantsCount?: number;
  timeslot?: string;
  endsAt?: string;
  startsAt?: string;
  timeInfo?: string;
  subtitle?: string;
  progress?: number;
  onPress?: () => void;
  style?: any;
  isLive?: boolean;
  isPending?: boolean;
  vibe?: string | null;
  buttonLabel?: string;
  messageCount: number;
  roomStatus?: "live" | "ended" | "scheduled";
  watchedBefore?: boolean;
}

export function LiveCard({
  variant = "detailed",
  avatarUrl,
  channelLogo,
  channelName,
  channelVerified = false,
  title,
  showTitle,
  votes,
  viewers = 0,
  reactions = [],
  extraReactionsCount = 0,
  participantAvatars = [],
  extraParticipantsCount = 0,
  endsAt,
  progress = 60,
  onPress,
  buttonLabel = "Join chat",
  showType,
  style,
  timeslot,
  year,
  description,
  banner,
  isLive = true,
  bgVariant,
  isPending,
  startsAt,
  vibe,
  messageCount,
  roomStatus,
  watchedBefore,
}: LiveCardProps) {
  const imageSource =
    banner || channelLogo || "https://via.placeholder.com/300";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className={`bg-primary border border-gray-800 overflow-hidden ${Platform.OS === "ios" ? "mb-3" : "mb-4"} rounded-2xl`}
      style={[style]}
    >
      {variant === "compact" ? (
        <LiveCompactCard
          roomStatus={roomStatus}
          channelLogo={channelLogo}
          channelName={channelName}
          showTitle={showTitle}
          isLive={isLive}
          viewers={viewers}
          watchedBefore={watchedBefore}
          reactions={reactions}
          messageCount={messageCount}
          participantAvatars={participantAvatars}
          extraParticipantsCount={0}
          extraReactionsCount={extraReactionsCount}
          endsAt={endsAt}
          startsAt={startsAt}
        />
      ) : variant === "show" ? (
        <View className="flex-row p-4">
          <View className="bg-white w-20 overflow-hidden rounded-xl mr-4 h-28">
            <FallbackImage
              uri={avatarUrl}
              style={{ width: "100%", height: "100%" }}
            />
          </View>

          <View className="flex-1">
            <Text variant="semibold" className="text-white text-lg">
              {title || "Untitled Show"}
            </Text>

            <View className="flex-row items-center mt-1">
              <Text className="text-muted-foreground mr-2">
                {formatISO(year || "") || "Unknown air date"}
              </Text>

              <View className="bg-blue-500 px-2 py-0.5 rounded-full">
                <Text variant="semibold" className="text-white  text-xs">
                  {showType}
                </Text>
              </View>
            </View>

            <Text
              numberOfLines={2}
              className="text-muted-foreground mt-2 text-sm"
            >
              {description || "No description available"}
            </Text>

            <Button
              className=" mt-4 rounded-2xl"
              textClassName="text-sm"
              size="sm"
              isLoading={isPending}
              disabled={isPending || !isLive}
              style={{
                width: Platform.OS === "web" ? 175 : 135,
                backgroundColor: PRIMARY_COLOR,
              }}
              textVariant="medium"
              onPress={onPress}
              icon={<MessageCircle size={16} color="#fff" />}
            >
              Open Chat
            </Button>
          </View>
        </View>
      ) : variant === "guide" ? (
        <ChannelCard
          vibe={vibe}
          bgVariant={bgVariant}
          backgroundImage={banner}
          channelName={channelName}
          buttonLabel={buttonLabel}
          channelLogo={channelLogo}
          avatarUrl={avatarUrl}
          timeslot={timeslot}
          isLive={isLive}
          reactions={reactions}
          viewers={viewers}
          title={title}
          description={description}
          onPress={() => {
            onPress?.();
          }}
        />
      ) : (
        <ImageBackground
          key={imageSource}
          source={{ uri: imageSource }}
          className="rounded-xl overflow-hidden bg-primary"
          imageStyle={{ borderRadius: 12 }}
        >
          <View style={{ backgroundColor: "#0f1729f2" }} className="p-7   pb-3">
            <View className="flex-row items-center mb-2.5">
              <View
                className="mr-3 p-2 bg-white rounded-xl"
                style={{ width: 58, height: 58 }}
              >
                <FallbackImage
                  uri={avatarUrl}
                  className="w-full h-full rounded-xl"
                  style={{ width: "100%", height: "100%" }}
                />
              </View>

              <View className="flex-row items-center flex-1">
                <Text
                  variant="medium"
                  className="text-muted-foreground text-[16px]"
                >
                  {channelName}
                </Text>

                {channelVerified && (
                  <Verified
                    size={15}
                    color="#95A3B8"
                    style={{ marginLeft: 4 }}
                  />
                )}

                {roomStatus === "live" ? (
                  <View className="flex-row items-center gap-1 ml-2">
                    <LiveBadge dotOnly className="bg-secondary" />
                    <Text style={{ color: "#f87171" }} variant="semibold">
                      LIVE
                    </Text>
                  </View>
                ) : (
                  <View className="flex-row items-center gap-1 ml-2">
                    <View className="w-2 h-2 rounded-full bg-gray-500" />
                    <Text style={{ color: "#9ca3af" }} variant="semibold">
                      ENDED
                    </Text>
                  </View>
                )}
                {watchedBefore && (
                  <View className="flex-row items-center ml-2 bg-white/10 px-1.5 py-0.5 rounded-full">
                    <Eye size={10} color="#9ca3af" />
                    <Text className="text-[10px] text-gray-400 ml-1 uppercase font-bold">
                      Watched
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <Text variant="bold" className="text-white text-2xl mt-1 mb-2.5">
              {title}
            </Text>

            <View className="flex-row flex-wrap items-center mb-3">
              <View className="flex-row items-center mr-3">
                <MessageCircle size={16} color={"#4ade80"} />
                <Text variant="medium" className="text-gray-300  ml-2">
                  {messageCount.toLocaleString()} chatting
                </Text>
              </View>

              {reactions.length > 0 && (
                <View className="mr-4">
                  <AnimatedEmojis emojis={reactions} />
                </View>
              )}

              {participantAvatars.length > 0 && (
                <View className="flex-row items-center">
                  {participantAvatars.slice(0, 4).map((user, i) => (
                    <AnimatedAvatar
                      key={i}
                      uri={user.display_name}
                      size={23}
                      className={i > 0 ? "-ml-2" : ""}
                    />
                  ))}

                  {extraParticipantsCount > 0 && (
                    <View style={[styles.participantAvatar, styles.extraBadge]}>
                      <Text className="text-muted-foreground">
                        +{extraParticipantsCount}
                      </Text>
                    </View>
                  )}

                  {extraReactionsCount > 0 && (
                    <Text className="text-gray-300 text-sm ml-1">
                      +{extraReactionsCount}
                    </Text>
                  )}
                </View>
              )}

              {endsAt && (
                <Text className="text-gray-400 text-sm ml-auto">
                  {formatEndsIn(endsAt)}
                </Text>
              )}
            </View>
          </View>

          <View className="h-1 bg-gray-800 relative overflow-hidden rounded-b-xl">
            <View
              className="absolute left-0 top-0 h-full bg-red-600"
              style={{ width: `${progress}%` }}
            />
          </View>
        </ImageBackground>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  participantAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#0f172a",
  },
  extraBadge: {
    backgroundColor: "#1f2937",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -8,
  },
  extraText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
});
