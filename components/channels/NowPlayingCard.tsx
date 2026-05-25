import FallbackImage from "@/components/ui/FallbackImage";
import { router } from "expo-router";
import { Users } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export const NowPlayingCard = ({ channel, nowPlaying, setRoom }: any) => {
  if (!channel) return null;

  const handleJoin = () => {
    const room = {
      id: channel.id,
      avatarUrl: channel.logo_url,
      channelName: channel.name,
      channelVerified: false,
      title: nowPlaying?.title ?? "Live",
      viewers: 0,
      reactions: [],
      extraReactionsCount: 0,
      participantAvatars: [],
      endsAt: nowPlaying?.ends_at ?? "",
      startsAt: nowPlaying?.starts_at ?? "",
      isLive: true,
      channelLogo: channel.logo_url,
      banner: channel.logo_url,
      description: nowPlaying?.title,
      vibe: nowPlaying?.vibe ?? null,
    };

    setRoom(room);

    router.push({
      pathname: "/home/[roomChatId]",
      params: { roomChatId: channel.id },
    });
  };

  return (
    <View className="px-4 mt-6">
      <View className="bg-primary border border-gray-800 rounded-2xl overflow-hidden">
        <View className="flex-row p-5">
          <View className="bg-white rounded-xl p-2 w-20 h-[66px] mr-4">
            <FallbackImage
              uri={channel.logo_url}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          <View className="flex-1">
            <Text className="text-white text-xl font-semibold leading-6">
              {nowPlaying?.title ?? "No program"}
            </Text>

            <Text className="text-gray-300 text-sm mt-1">
              {nowPlaying?.category ?? "Live broadcast happening now"}
            </Text>

            <Text className="text-gray-400 text-xs mt-2">
              {nowPlaying?.ends_at
                ? `Ends at ${new Date(nowPlaying.ends_at).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}`
                : "Live now"}
            </Text>
          </View>
        </View>

        <View className="border-t border-gray-800 flex-row items-center justify-between px-5 py-4">
          <View className="flex-row items-center gap-2">
            <Users color="#fff" size={18} />
            <Text className="text-white text-sm">0 watching</Text>
          </View>

          <TouchableOpacity
            onPress={handleJoin}
            className="bg-secondary px-5 py-2 rounded-xl"
          >
            <Text className="text-white font-semibold text-sm">Watch Live</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
