import { Button } from "@/components/common/Button";
import { useToast } from "@/components/context/ToastContext";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { Text } from "@/components/ui/Text";
import { PRIMARY_COLOR } from "@/constants/constants";
import { useInviteFriends } from "@/hooks/invite/useInvite";
import { useGetFriends } from "@/hooks/profile/useGetFriends";
import { useAuthStore } from "@/store/authStore";
import { formatViewers } from "@/utils/formatViewer";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { Copy, Gift, Share2, Users } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InviteFriends() {
  const { back } = router;
  const [inviteLink, setInviteLink] = useState<string>("");
  const { mutate, isPending } = useInviteFriends(setInviteLink);
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const { data } = useGetFriends();
  const stats = {
    rewards: user?.gamification?.xp || 0,
    friends: data?.friends.length || 0,
  };
  const handleCopy = async () => {
    try {
      if (!inviteLink) {
        mutate();
        return;
      }
      await Clipboard.setStringAsync(inviteLink);
      showToast("Copied to clipboard", "success");
    } catch (err) {}
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <SettingsHeader back={back}>Invite & Referrals</SettingsHeader>

      <View className="p-6">
        <View className="items-center mt-4 mb-8">
          <View style={styles.iconCircle}>
            <View style={styles.iconInnerGlow}>
              <Users size={42} color={PRIMARY_COLOR} strokeWidth={1.5} />
            </View>
          </View>

          <Text variant="bold" className="text-white text-3xl text-center mt-6">
            Share the Love
          </Text>
          <Text className="text-gray-400 text-center text-base mt-2 px-4 leading-6">
            Invite your inner circle to showchats platform and unlock premium
            perks for everyone.
          </Text>
        </View>

        <View className="flex-row gap-4 mb-10">
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconContainer,
                { backgroundColor: "rgba(64, 244, 52, 0.05)" },
              ]}
            >
              <Gift size={20} color="#4ADE80" />
            </View>
            <Text variant="bold" className="text-white text-2xl mt-4">
              {formatViewers(stats.rewards)} XP
            </Text>
            <Text className="text-gray-300 text-xs uppercase tracking-widest mt-1">
              Rewards
            </Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconContainer,
                { backgroundColor: "rgba(64, 244, 52, 0.05)" },
              ]}
            >
              <Users size={20} color="#4ADE80" />
            </View>
            <Text variant="bold" className="text-white text-2xl mt-4">
              {stats.friends}
            </Text>
            <Text className="text-gray-300 text-xs uppercase tracking-widest mt-1">
              Referrals
            </Text>
          </View>
        </View>

        <View className="flex-col gap-4">
          <Button
            icon={<Share2 size={20} color="white" />}
            textVariant="semibold"
            textClassName="text-lg"
            onPress={() => mutate()}
            isLoading={isPending}
            disabled={isPending}
            style={{ backgroundColor: PRIMARY_COLOR }}
            size="lg"
            className="rounded-2xl h-16 "
          >
            Send Invite
          </Button>

          <Button
            rightIcon={
              <Copy size={18} color={inviteLink ? PRIMARY_COLOR : "#d1d5db"} />
            }
            textClassName={
              inviteLink ? "text-white text-base" : "text-gray-300 text-base"
            }
            variant="outline"
            size="lg"
            disabled={!inviteLink && !isPending}
            onPress={handleCopy}
            className="rounded-2xl border-[#252f47]  h-16 bg-[#161c2f]/50"
          >
            {inviteLink ? "Copy Referral Link" : "Generate Link"}
          </Button>
        </View>

        <Text className="text-gray-400 text-center text-xs mt-4 italic">
          Terms and conditions apply to referral rewards.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#0f1729",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  iconInnerGlow: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 20,
    borderRadius: 24,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  statIconContainer: {
    padding: 10,
    borderRadius: 12,
  },
});
