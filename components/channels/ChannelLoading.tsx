import SafeAreaWrapper from "@/components/ui/SafeAreaWrapper";
import { ActivityIndicator, Text, View } from "react-native";

export const ChannelLoading = () => {
  return (
    <SafeAreaWrapper className="flex-1 bg-background justify-center items-center">
      <View>
        <ActivityIndicator color="#f44034" size="small" />
        <Text className="text-gray-500 text-center text-[10px] mt-2 uppercase tracking-tighter">
          Loading channel...
        </Text>
      </View>
    </SafeAreaWrapper>
  );
};
