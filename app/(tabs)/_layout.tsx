import TabBar from "@/components/common/TabBar";
import { useAuthStore } from "@/store/authStore";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { router, Tabs, useSegments } from "expo-router";
import React from "react";
import { Platform } from "react-native";

const Layout: React.FC = () => {
  const segments = useSegments();
  const session = useAuthStore((state) => state.session);
  const isAuthenticated = !!session?.access_token;

  const isChildScreen = segments.length > 2;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: isChildScreen ? "none" : "flex",
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          backgroundColor: "transparent",
        },
      }}
      tabBar={(props: BottomTabBarProps) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Live",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
        }}
        listeners={{
          tabPress: (e) => {
            if (!isAuthenticated) {
              e.preventDefault();
              router.push("/sign-in");
            }
          },
        }}
      />

      <Tabs.Screen
        name="guide"
        options={{
          title: "Guide",
        }}
        listeners={{
          tabPress: (e) => {
            if (!isAuthenticated) {
              e.preventDefault();
              router.push("/sign-in");
            }
          },
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
        listeners={{
          tabPress: (e) => {
            if (!isAuthenticated) {
              e.preventDefault();
              router.push("/sign-in");
            }
          },
        }}
      />
    </Tabs>
  );
};

export default Layout;
