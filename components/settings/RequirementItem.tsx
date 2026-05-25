import { CheckCircle2 } from "lucide-react-native";
import { View } from "react-native";
import { Text } from "../ui/Text";

export const RequirementItem = ({
  met,
  text,
}: {
  met: boolean;
  text: string;
}) => (
  <View className="flex-row  items-center opacity-80">
    <CheckCircle2 size={14} color={met ? "#00FFC2" : "#334155"} />
    <Text className={`ml-2 text-xs ${met ? "text-gray-200" : "text-gray-500"}`}>
      {text}
    </Text>
  </View>
);
