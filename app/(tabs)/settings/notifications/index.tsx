import { Button } from "@/components/common/Button";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import SafeAreaWrapper from "@/components/ui/SafeAreaWrapper";
import { Text } from "@/components/ui/Text";
import { PRIMARY_COLOR } from "@/constants/constants";
import {
  useUpdatePreferences,
  useUserPreferences,
} from "@/hooks/user-preference/useUserPreference";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Switch, TouchableOpacity, View } from "react-native";

const CATEGORIES = ["General", "Social", "Promotions", "Security", "Updates"];

const NotificationsSettingScreen = () => {
  const { data: preferences } = useUserPreferences();
  const { mutate, isPending } = useUpdatePreferences();

  const [localPush, setLocalPush] = useState(true);
  const [localSilent, setLocalSilent] = useState(false);
  const [localCategories, setLocalCategories] = useState<string[]>([]);

  useEffect(() => {
    if (preferences) {
      setLocalPush(preferences.opt_in_notifications ?? true);
      setLocalSilent(preferences.silent_mode_default ?? false);
      setLocalCategories(preferences.preferred_categories ?? []);
    }
  }, [preferences]);

  const handleSave = () => {
    mutate({
      opt_in_notifications: localPush,
      silent_mode_default: localSilent,
      preferred_categories: localCategories,
    });
  };

  const toggleCategory = (category: string) => {
    setLocalCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const SettingRow = ({
    label,
    description,
    value,
    onValueChange,
    showBorder = true,
  }: {
    label: string;
    description?: string;
    value: boolean;
    showBorder?: boolean;
    onValueChange: (val: boolean) => void;
  }) => (
    <View
      className={`flex-row items-center justify-between py-4 px-4 bg-primary ${showBorder ? "border-b" : "border-none"} border-white/5 mb-[1px]`}
    >
      <View className="flex-1 pr-4">
        <Text variant="semibold" className="text-[16px] text-[#F2F3F5]">
          {label}
        </Text>
        {description && (
          <Text className="text-[13px] text-[#949BA4] mt-1 leading-4">
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        
        trackColor={{ false: "#4E5058", true: PRIMARY_COLOR }}
        thumbColor="#fff"
        ios_backgroundColor="#4E5058"
      />
    </View>
  );

  return (
    <SafeAreaWrapper>
      <View className="flex-1">
        <SettingsHeader
          back={() => router.replace("/settings")}
          extraChild={
            <Button
              onPress={handleSave}
              isLoading={isPending}
              textStyles={{ color: PRIMARY_COLOR }}
              icon={
                <Ionicons size={20} color={PRIMARY_COLOR} name="save-outline" />
              }
              variant="ghost"
            >
              Save
            </Button>
          }
        >
          Notifications
        </SettingsHeader>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}
        >
          <View className="mt-6">
            <Text className="mb-2 text-[12px] font-bold uppercase tracking-wider text-zinc-300">
              System Notifications
            </Text>
            <View className="overflow-hidden rounded-xl">
              <SettingRow
                label="Allow Push Notifications"
                description="Receive alerts for new activity."
                value={localPush}
                onValueChange={setLocalPush}
              />
              <SettingRow
                label="Silent Mode"
                description="Mute notification sounds by default."
                value={localSilent}
                showBorder={false}
                onValueChange={setLocalSilent}
              />
            </View>
          </View>

          <View className="mt-8">
            <Text className="mb-1 text-[12px] font-bold uppercase tracking-wider text-zinc-300">
              Preferred Categories
            </Text>
            <Text className="mb-3  text-[12px] text-[#949BA4]">
              Select the topics you want to hear from us about.
            </Text>
            <View className="flex-row flex-wrap gap-2  bg-primary p-4 rounded-xl border border-white/5">
              {CATEGORIES.map((category) => {
                const isSelected = localCategories.includes(category);
                return (
                  <TouchableOpacity
                    key={category}
                    onPress={() => toggleCategory(category)}
                    activeOpacity={0.7}
                    style={{
                      backgroundColor: isSelected ? PRIMARY_COLOR : "#0f1729",
                      borderColor: isSelected
                        ? PRIMARY_COLOR
                        : " rgb(255 255 255 / 0.1)",
                    }}
                    className={`px-4 py-2 rounded-full border`}
                  >
                    <Text
                      className={`text-[13px] font-medium ${
                        isSelected ? "text-white" : "text-[#B5BAC1]"
                      }`}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View className="px-6 mt-4">
            <Text className="text-[12px] text-[#949BA4] leading-5 text-center italic">
              Critical security and account alerts are sent via email regardless
              of these settings.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
};

export default NotificationsSettingScreen;
