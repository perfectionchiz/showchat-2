import { Sparkles } from "lucide-react-native";
import { Text, View } from "react-native";

export const AchievementFooter = () => {
  return (
    <View className="mt-5 mb-10 px-6 py-8 rounded-3xl border border-dashed border-white/20 bg-white/5 items-center">
      <View className="bg-orange-500/20 p-3 rounded-full mb-4">
        <Sparkles size={24} color="#fb923c" />
      </View>

      <Text className="text-white text-lg font-bold text-center mb-2">
        Unlock Your Full Potential
      </Text>

      <Text className="text-gray-400 text-center leading-5 text-[13px]">
        Every reaction, message, and hosted room brings you closer to your next
        achievement.
        <Text className="text-orange-400 font-bold"> Participate daily </Text>
        to earn exclusive badges and climb the ranks!
      </Text>
    </View>
  );
};
