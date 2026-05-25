import SafeAreaWrapper from "@/components/ui/SafeAreaWrapper";
import { Text, View } from "react-native";

export const ChannelError = () => {
  return (
    <SafeAreaWrapper className="flex-1 bg-background">
      <View className="flex-1 mt-4 justify-center items-center">
        <Text className="text-red-500 text-center">
          Something went wrong (Failed to load channel)
        </Text>
      </View>
    </SafeAreaWrapper>
  );
};
