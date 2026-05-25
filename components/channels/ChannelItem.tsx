import { Channel } from "@/models/channel.model";
import { formatTime } from "@/utils/getTimeSlot";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { LiveCard } from "../live/LiveCard";

type Props = {
  item: Channel;
};

const ChannelItemComponent = ({ item }: Props) => {
  const timeslot = item.live_program?.end_time
    ? `Ends at ${formatTime(item.live_program.end_time)}`
    : "";

  return (
    <View className="px-4">
      <LiveCard
        banner={item.logo_url || ""}
        variant="guide"
        channelName={item.name}
        channelLogo={item.logo_url || ""}
        avatarUrl={item.logo_url || ""}
        isLive={item.is_live}
        timeslot={timeslot}
        viewers={item.upcoming_count}
        title={item.live_program?.title}
        messageCount={0}
        vibe={item.live_program?.vibe}
        onPress={() => {
          router.push({
            pathname: "/channels/[channelId]",
            params: { channelId: `${item.slug}` },
          });
        }}
        buttonLabel="view channel"
      />
    </View>
  );
};

export const ChannelItem = React.memo(ChannelItemComponent);
