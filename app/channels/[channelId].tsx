import { ChannelError } from "@/components/channels/ChannelError";
import { ChannelHeader } from "@/components/channels/ChannelHeader";
import { ChannelLoading } from "@/components/channels/ChannelLoading";
import { NowPlayingCard } from "@/components/channels/NowPlayingCard";
import EmptyState from "@/components/ui/EmptyState";
import SafeAreaWrapper from "@/components/ui/SafeAreaWrapper";
import { useGetChannelPage } from "@/hooks/channels/useChannelPage";
import { useRoomStore } from "@/store/roomStore";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

const ChannelId = () => {
  const { channelId } = useLocalSearchParams<{ channelId: string }>();

  const { data, isLoading, isError, refetch } = useGetChannelPage({
    slug: channelId,
  });

  const setRoom = useRoomStore((s) => s.setRoom);

  const channel = data?.channel;
  const nowPlaying = data?.nowPlaying;


  return (
    <SafeAreaWrapper className="flex-1 bg-background">
      <ChannelHeader channel={channel} />
      <View className="flex-1">
        {isLoading && <ChannelLoading />}

        {isError && <ChannelError />}

        {!isLoading && !isError && !channel && (
          <EmptyState
            title="Channel data not found"
            description="please check back later"
            onButtonPress={refetch}
            buttonText="Refresh"
          />
        )}

        {!isLoading && !isError && channel && (
          <NowPlayingCard
            channel={channel}
            nowPlaying={nowPlaying}
            setRoom={setRoom}
          />
        )}
      </View>
    </SafeAreaWrapper>
  );
};

export default ChannelId;
