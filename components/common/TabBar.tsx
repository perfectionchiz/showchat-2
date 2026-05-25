import { IconName } from "@/assets/icons/icons";
import { PRIMARY_COLOR } from "@/constants/constants";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSegments } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import TabBarButton from "./TabBarButton";

const routeToIconMap: Record<string, IconName> = {
  home: "home",
  chats: "chats",
  guide: "guide",
  settings: "settings",
};

const TabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const primaryColor = PRIMARY_COLOR;
  const greyColor = "#fff";
  const segments = useSegments();

  const isChildScreen = segments.length > 2;

  return (
    <View style={[styles.tabbar, { display: isChildScreen ? "none" : "flex" }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const badge = options.tabBarBadge;

        const label =
          typeof options.tabBarLabel === "string"
            ? options.tabBarLabel
            : (options.title ?? route.name);

        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const isFocused = state.index === index;

        const cleanRouteName = route.name.replace(/^\(.*\)\//, "");

        const iconName = routeToIconMap[cleanRouteName];
        if (!iconName) {
          console.warn("No icon mapped for route:", route.name);
          return null;
        }

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name as never);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.key}
            style={styles.tabbarItem}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={iconName}
            color={isFocused ? primaryColor : greyColor}
            label={label}
            badge={badge}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0f1729",
    paddingBottom: 36,
    paddingTop: 14,
    paddingHorizontal: 16,
    width: "100%",
    borderTopColor: "#1F2937",
    borderTopWidth: 1,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  tabbarItem: {
    flex: 1,
    alignItems: "center",
  },
});

export default TabBar;
