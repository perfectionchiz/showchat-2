import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text } from "../ui/Text";

export default function Footer() {
  return (
    <View className="flex-row items-center justify-center border-t border-t-gray-800 h-[100px]">
      <Ionicons name="radio-outline" size={20} color="#ef4444" />
      <Text variant="medium" className="text-gray-400 font-medium ml-2">
        Show Chats © {new Date().getFullYear()}
      </Text>
    </View>
  );
}
