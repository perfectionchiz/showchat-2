import { ConfirmModal } from "@/components/common/ConfirmAlertModal";
import { PrivacyModalContent } from "@/components/settings/Privacy";
import { SettingsItem } from "@/components/settings/SettingItem";
import { BaseModal } from "@/components/ui/BaseModal";
import SafeAreaWrapper from "@/components/ui/SafeAreaWrapper";
import { Text } from "@/components/ui/Text";
import { useLogout } from "@/hooks/auth/useLogout";
import { useConfirm } from "@/hooks/useAlert";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useState } from "react";
import { ScrollView, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const [isPrivacyVisible, setIsPrivacyVisible] = useState(false);
  const { confirm, ConfirmModalProps } = useConfirm();
  const { mutateAsync } = useLogout();
  const handleLogout = () => {
    confirm("Log Out", "This will log you out . Continue?", async () => {
      try {
        await mutateAsync({ scope: "local" });
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <SafeAreaWrapper>
      <View className="mt-3 px-6 py-3 border-b border-gray-800">
        <Text style={{ fontSize: 25 }} variant="bold" className=" text-white">
          Settings
        </Text>
      </View>
      <ScrollView
        className="px-4   flex-1"
        showsVerticalScrollIndicator={false}
      >
        <Text
          variant="medium"
          className="text-gray-400 px-2 text-sm mb-3 mt-4 uppercase tracking-wider"
        >
          Account settings
        </Text>
        <View className="p-5 bg-primary rounded-2xl">
          <SettingsItem
            label="Profile"
            onPress={() => router.push("/settings/profile")}
            icon={<Ionicons name="person" size={22} color="#95A3B8" />}
          />

          <SettingsItem
            label="Update Password"
            onPress={() => router.push("/settings/update-password")}
            icon={<Ionicons name="lock-closed" size={22} color="#95A3B8" />}
          />

          <SettingsItem
            label="Notifications"
            onPress={() => router.push("/settings/notifications")}
            showBorder={false}
            icon={<Ionicons name="notifications" size={22} color="#95A3B8" />}
          />

          {/* <SettingsItem
            label="Blocked Users"
            showBorder={false}
            onPress={comingSoon}
            icon={<Ionicons name="ban" size={22} color="#95A3B8" />}
          /> */}
        </View>
        <Text
          variant="medium"
          className="text-gray-400 text-sm mt-4 px-2 mb-3 uppercase tracking-wider"
        >
          App & Device
        </Text>
        <View className="p-6 bg-primary rounded-2xl ">
          <SettingsItem
            label="Device"
            onPress={() => router.push("/settings/devices")}
            icon={<Ionicons name="phone-portrait" size={22} color="#95A3B8" />}
          />

          <SettingsItem
            label="Invite / Referrals"
            showBorder={false}
            onPress={() => router.push("/settings/invite-refferals")}
            icon={<Ionicons name="gift" size={22} color="#95A3B8" />}
          />
        </View>
        <Text
          variant="medium"
          className="text-gray-400 text-sm mt-4 px-2 mb-3 uppercase tracking-wider"
        >
          Support
        </Text>
        <View className="px-6 py-2 bg-primary rounded-2xl ">
          {/* <SettingsItem
            label="Help / Support"
            onPress={comingSoon}
            icon={<Ionicons name="help" size={22} color="#95A3B8" />}
          /> */}
          {/* 
          <SettingsItem
            label="Report Bug"
            onPress={comingSoon}
            icon={
              <Ionicons name="alert-circle-outline" size={22} color="#95A3B8" />
            }
          /> */}

          <SettingsItem
            label="Terms / Privacy"
            showBorder={false}
            onPress={() => setIsPrivacyVisible(true)}
            icon={<Ionicons name="document-lock" size={22} color="#95A3B8" />}
          />
        </View>
        <Text
          variant="medium"
          className="text-gray-400 text-sm mt-4 px-2 mb-3 uppercase tracking-wider"
        >
          Logout
        </Text>
        <View className="px-4 mb-6 bg-primary rounded-2xl ">
          <SettingsItem
            label="Logout"
            onPress={handleLogout}
            showChevron={false}
            showBorder={false}
            icon={<Ionicons name="log-out" size={22} color="#f44034" />}
          />
        </View>
      </ScrollView>
      <ConfirmModal destructive {...ConfirmModalProps} />
      <BaseModal
        snapPoints={["100%"]}
        isOpen={isPrivacyVisible}
        onClose={() => setIsPrivacyVisible(false)}
      >
        <PrivacyModalContent />
      </BaseModal>
    </SafeAreaWrapper>
  );
}
