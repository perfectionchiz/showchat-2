import { IconButton } from "@/components/common/IconButton";
import FallbackImage from "@/components/ui/FallbackImage";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Text, View } from "react-native";

export const ChannelHeader = ({ channel }: any) => {
  return (
    <View className="p-4 mt-2 border-b border-gray-800 pb-6 flex-row items-center justify-center relative">
      <View className="absolute left-4">
        <IconButton
          onPress={() => router.back()}
          icon={<ArrowLeft size={20} color="#fff" />}
          className="bg-primary rounded-full"
        />
      </View>

      <View className="flex-row items-center gap-3">
        {channel?.logo_url && (
          <FallbackImage
            uri={channel.logo_url}
            className="w-10 h-10 rounded-full bg-white"
          />
        )}

        <Text className="text-white text-lg font-semibold">
          {channel?.name || "Channel"}
        </Text>
      </View>
    </View>
  );
};
