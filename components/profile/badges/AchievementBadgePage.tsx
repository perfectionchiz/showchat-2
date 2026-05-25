import { BaseModal } from "@/components/ui/BaseModal";
import { Text } from "@/components/ui/Text";
import { Gem } from "lucide-react-native";
import { View } from "react-native";
import { AchievementFooter } from "./Achievement footer";
import { AchievementBadge } from "./AchievementBadge";

export const AchievementShowcase = ({
  badges,
  isOpen,
  setClose,
}: {
  badges: any[];
  isOpen: boolean;
  setClose: () => void;
}) => {
  const sortedBadges = [...(badges || [])].sort(
    (a, b) => new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime(),
  );

  return (
    <BaseModal onClose={setClose} isOpen={isOpen}>
      <View className="mt-3 px-6">
        <View className="flex-row items-end justify-between mb-6 px-1">
          <View>
            <Text
              variant="semibold"
              className="text-gray-500 text-[10px] uppercase tracking-[3px]  mb-1"
            >
              Progression
            </Text>
            <Text variant="bold" className="text-white text-2xl tracking-tight">
              Achievements
            </Text>
          </View>

          <View className="bg-white/5 px-3 py-1.5 rounded-2xl border flex-row items-center gap-1 border-white/10">
            <Text className=" font-bold text-sm">{badges.length}</Text>
            <Gem size={17} color={"#eab308"} />
          </View>
        </View>
        <View className="flex-row flex-wrap justify-between">
          {sortedBadges.map((badge) => (
            <AchievementBadge
              key={badge.badge_type}
              name={badge.badge_name}
              description={badge.badge_description}
              isEarned={true}
              date={badge.earned_at}
            />
          ))}
        </View>
        <AchievementFooter />
      </View>
    </BaseModal>
  );
};
