import { Ionicons } from "@expo/vector-icons";
import React from "react";

type IconProps = {
  color: string;
  size?: number;
  active?: boolean;
};

export const icons = {
  home: ({ color, size = 21, active }: IconProps) => (
    <Ionicons name={active ? "tv" : "tv-outline"} color={color} size={size} />
  ),

  chats: ({ color, size = 21, active }: IconProps) => (
    <Ionicons
      name={active ? "chatbubble" : "chatbubble-outline"}
      color={color}
      size={size}
    />
  ),

  guide: ({ color, size = 21, active }: IconProps) => (
    <Ionicons
      name={active ? "book" : "book-outline"}
      color={color}
      size={size}
    />
  ),

  settings: ({ color, size = 22, active }: IconProps) => (
    <Ionicons name={active ? "cog" : "cog-outline"} color={color} size={size} />
  ),
};

export type IconName = keyof typeof icons;
