import { resolveVibe } from "@/utils/resolveVibe";
import { Platform, View } from "react-native";
import { Text } from "../ui/Text";
export const RoomVibeHeader = ({
  vibe,
  mode,
}: {
  vibe: string;
  mode: "emoji" | "text" | "both";
}) => {
  const v = resolveVibe(vibe);
  return (
    <View className="flex-row justify-center items-center ">
      <View
        style={
          Platform.OS !== "web" && {
            shadowColor: "#6366f1",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }
        }
        className="flex-row items-center"
      >
        <View className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 shadow-lg shadow-indigo-500 ml-1" />

        <Text className="text-gray-300 font-black uppercase text-[9px] tracking-[2px] mr-1">
          Vibe
        </Text>

        <Text className="text-white text-sm font-bold tracking-tight">
          {mode === "emoji" && v.emoji}
          {mode === "text" && v.label}
          {mode === "both" && `${v.emoji} ${v.label}`}
        </Text>
      </View>
    </View>
  );
};
