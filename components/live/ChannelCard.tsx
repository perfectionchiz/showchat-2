import { PRIMARY_COLOR } from "@/constants/constants";
import { formatViewers } from "@/utils/formatViewer";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import { RoomVibeHeader } from "../chat/RoomVibeHeader";
import { Button } from "../common/Button";
import FallbackImage from "../ui/FallbackImage";
import { Text } from "../ui/Text";
import { LiveBadge } from "./LiveBadge";

interface ChannelCardProps {
  channelLogo?: string;
  channelName?: string;
  avatarUrl?: string;
  timeslot?: string;
  isLive?: boolean;
  title?: string;
  description?: string;
  vibe?: string | null;
  viewers?: number;
  reactions?: { emoji: string; count: number }[];
  onPress: () => void;
  backgroundImage?: string | ImageSourcePropType;
  bgVariant?: "header" | "full" | "none";
  buttonLabel?: string;
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  avatarUrl,
  timeslot,
  isLive,
  title,
  onPress,
  viewers,
  backgroundImage,
  description,
  buttonLabel,
  bgVariant = "none",
  vibe,
}) => {
  const isFullBg = bgVariant === "full";
  const isHeaderBg = bgVariant === "header";
  const bgSource =
    typeof backgroundImage === "string"
      ? { uri: backgroundImage }
      : backgroundImage;

  return (
    <View className="mb-4 overflow-hidden">
      {isFullBg && backgroundImage && (
        <Image
          source={bgSource as any}
          height={100}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      )}
      {isFullBg && (
        <View
          style={{ backgroundColor: "#0f1729f2" }}
          className=" h-full w-full absolute"
        ></View>
      )}

      <View className="flex-1">
        <View
          className={` flex-row items-center gap-2 ${!isHeaderBg && !isFullBg ? "border-b border-[#242d4280]" : ""}`}
        >
          {isHeaderBg && backgroundImage && (
            <Image
              source={bgSource as any}
              style={StyleSheet.absoluteFill}
              className="rounded-t-2xl"
              resizeMode="cover"
            />
          )}

          {isHeaderBg && (
            <View
              style={StyleSheet.absoluteFill}
              className="bg-black/30 rounded-t-2xl"
            />
          )}
        </View>
        <View className="flex-row p-6">
          <View
            className=" bg-white rounded-xl p-2 w-20 mr-4"
            style={{ height: 66 }}
          >
            <FallbackImage
              uri={avatarUrl}
              className="w-full h-full"
              style={{ width: "100%", height: "100%" }}
            />
          </View>

          <View className="flex-1">
            <Text
              variant="semibold"
              className="text-white text-xl leading-6 mt-1"
            >
              {title}
            </Text>

            <View className="flex-row items-center mt-1">
              {isLive ? (
                <LiveBadge />
              ) : (
                <View className="flex-row items-center gap-1 ml-2">
                  <View className="w-2 h-2 rounded-full bg-gray-500" />
                  <Text style={{ color: "#9ca3af" }} variant="semibold">
                    ENDED
                  </Text>
                </View>
              )}
              <Text variant="medium" className="text-gray-300 text-sm ml-2">
                {timeslot}
              </Text>
            </View>
            <Text numberOfLines={2} className="text-gray-300 text-sm mt-2 ">
              {description}
            </Text>
          </View>
        </View>
        <View className=" border-t flex-row items-center justify-between px-6   border-gray-800">
          <View className="flex-row items-center mt-4 gap-x-2">
            <View className="flex-row items-center gap-x-1">
              <Ionicons size={23} name="people" color={"#FFB800"} />
              <Text variant="semibold" className="">
                {formatViewers(viewers || 0)}
              </Text>
            </View>
            <RoomVibeHeader mode="emoji" vibe={vibe ?? ""} />
          </View>
          <Button
            className="w-[120px] mt-4 rounded-2xl"
            textClassName="text-sm"
            size="sm"
            onPress={onPress}
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            {buttonLabel}
          </Button>
        </View>
      </View>
    </View>
  );
};

export default ChannelCard;
