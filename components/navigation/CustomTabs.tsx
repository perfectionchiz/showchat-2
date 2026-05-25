import { PRIMARY_COLOR } from "@/constants/constants";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../ui/Text";

interface Tab {
  label: string;
  value: "now" | "upnext" | "later";
}

interface CustomTabsProps {
  tabs: Tab[];
  activeTab: "now" | "upnext" | "later";
  onTabChange: (value: "now" | "upnext" | "later") => void;
  fullWidth?: boolean;
  extraRight?: React.ReactNode;
}

export function CustomTabs({
  tabs,
  activeTab,
  onTabChange,
  fullWidth = true,
  extraRight,
}: CustomTabsProps) {
  return (
    <View
      className={`flex-row items-center gap-2 ${fullWidth ? "w-full" : ""}`}
    >
      <View className="flex-row gap-2 flex-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <TouchableOpacity
              key={tab.value}
              onPress={() => onTabChange(tab.value)}
              activeOpacity={0.7}
              style={{ backgroundColor: isActive ? PRIMARY_COLOR : "#1f2937" }}
              className={`px-5 py-2 rounded-3xl  ${
                isActive ? " border" : "bg-gray-800"
              }`}
            >
              <Text
                variant="medium"
                className={`text-center ${
                  isActive ? "text-white" : "text-zinc-300"
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {extraRight && <View>{extraRight}</View>}
    </View>
  );
}
