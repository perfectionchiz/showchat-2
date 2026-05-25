import { ArrowLeft } from "lucide-react-native";
import { View } from "react-native";
import { Button } from "../common/Button";

import { Text } from "../ui/Text";
interface NoRoomData {
  goBack: () => void;
}
export const NoRoom = ({ goBack }: NoRoomData) => {
  return (
    <View className="flex-1 justify-center items-center p-4">
      <Button
        icon={<ArrowLeft size={16} color="white" />}
        onPress={goBack}
        className="flex-row items-center bg-gray-700 px-4 py-2 rounded"
      >
        <Text className="text-white ml-2">Back</Text>
      </Button>
      <Text className="text-white text-xl mt-6">Room not found</Text>
    </View>
  );
};
