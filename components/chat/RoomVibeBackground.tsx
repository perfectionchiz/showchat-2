import { normalizeVibeKey } from "@/utils/resolveVibe";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet } from "react-native";

export const VIBE_PALETTE: Record<string, [string, string]> = {
  NO_SPOILERS: ["#f97316", "transparent"],
  SPOILERS: ["#3b0a0a", "transparent"],
  SPOILER_DISCUSSION: ["#4c1d1d", "transparent"],
  SPOILER_FREE_ZONE: ["#111827", "transparent"],

  CHILL: ["#0f2e33", "transparent"],
  CALM: ["#0b2a2a", "transparent"],
  RELAXED: ["#111827", "transparent"],
  QUIET_ROOM: ["#0f172a", "transparent"],

  HYPE: ["#4c1d95", "transparent"],
  INTENSE: ["#5b21b6", "transparent"],
  CHAOS: ["#7f1d1d", "transparent"],
  OVERFLOWING_CHAT: ["#9a3412", "transparent"],
  FUNNY: ["#422006", "transparent"],
  MEMEABLE: ["#713f12", "transparent"],
  CRINGE: ["#3f3f46", "transparent"],
  EMOTIONAL: ["#172554", "transparent"],
  DEEP: ["#1e3a8a", "transparent"],
  MIND_BENDING: ["#0f172a", "transparent"],
  CONFUSING: ["#334155", "transparent"],
  WHOLESOME: ["#14532d", "transparent"],
  ROMANTIC: ["#500724", "transparent"],
  SERIOUS: ["#334155", "#0b1220"],
  DARK: ["#0a0a0a", "transparent"],
  LIGHT_HEARTED: ["#1f2937", "transparent"],
  LOW_ENERGY: ["#0f172a", "transparent"],
  MEDIUM_ENERGY: ["#1e293b", "transparent"],
  HIGH_ENERGY: ["#4c1d95", "transparent"],
  TRENDING: ["#1e3a8a", "transparent"],
  VIRAL: ["#7c3aed", "transparent"],
  ACTIVE: ["#0f172a", "transparent"],
  LOW_ACTIVITY: ["#111827", "transparent"],
  BINGE_WORTHY: ["#3f6212", "transparent"],
  REWATCHABLE: ["#14532d", "transparent"],
  CLIFFHANGER: ["#9a3412", "transparent"],
  SLOW_BURN: ["#0f172a", "transparent"],
  FAST_PACED: ["#4c1d95", "transparent"],
  UNHINGED: ["#7f1d1d", "transparent"],
  DRAMA: ["#4c0519", "transparent"],
  CONTROVERSIAL: ["#1e1b4b", "transparent"],
  PLOT_TWIST: ["#4c0519", "transparent"],
  NEWLY_CREATED: ["#0f172a", "transparent"],
  CURATED: ["#1e293b", "transparent"],
  EDITOR_PICK: ["#1e3a8a", "transparent"],
  RECOMMENDED: ["#14532d", "transparent"],
  HIDDEN_GEM: ["#0f2e33", "transparent"],

  Default: ["#0b1220", "transparent"],
};

export const RoomBackgroundGradient = ({ vibe }: { vibe: string }) => {
  const key = normalizeVibeKey(vibe);

  const colors = VIBE_PALETTE[key] || VIBE_PALETTE.Default;

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
      pointerEvents="none"
    />
  );
};
