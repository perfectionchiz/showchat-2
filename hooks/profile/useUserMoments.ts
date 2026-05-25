import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const DISMISSED_KEYS = {
  STREAK: "moment-streak-dismissed",
  XP: "moment-xp-dismissed",
  LEVEL: "moment-level-dismissed", // Added for level-up tracking
};

interface UserStats {
  streak: number;
  lastSeen: string | null;
  xp: number;
  level: number;
  xpToNextLevel: number; // New field from backend
}

export type MomentType = "STREAK" | "XP_PROGRESS" | "LEVEL_UP" | null;

export const useUserMoments = (stats: UserStats) => {
  const [activeMoment, setActiveMoment] = useState<MomentType>(null);
  const [extraData, setExtraData] = useState<any>(null);

  useEffect(() => {
    const checkMoments = async () => {
      const today = new Date().toDateString();

      const lastSeenLevel = await AsyncStorage.getItem("last-known-level");
      if (lastSeenLevel && parseInt(lastSeenLevel) < stats.level) {
        setActiveMoment("LEVEL_UP");
        setExtraData({ newLevel: stats.level });
        await AsyncStorage.setItem("last-known-level", stats.level.toString());
        return;
      }
      if (!lastSeenLevel)
        await AsyncStorage.setItem("last-known-level", stats.level.toString());
      const hasBeenActiveToday =
        stats.lastSeen && new Date(stats.lastSeen).toDateString() === today;
      const lastStreakDismiss = await AsyncStorage.getItem(
        DISMISSED_KEYS.STREAK,
      );

      if (
        stats.streak > 0 &&
        !hasBeenActiveToday &&
        lastStreakDismiss !== today
      ) {
        setActiveMoment("STREAK");
        return;
      }
      const threshold = stats.xpToNextLevel * 0.2;
      const isCloseToLevelUp = stats.xpToNextLevel - stats.xp <= threshold;

      if (isCloseToLevelUp && stats.xpToNextLevel > 0) {
        const lastXpDismiss = await AsyncStorage.getItem(DISMISSED_KEYS.XP);
        if (lastXpDismiss !== today) {
          setActiveMoment("XP_PROGRESS");
          setExtraData({
            xpRemaining: stats.xpToNextLevel - stats.xp,
            nextLevel: stats.level + 1,
          });
          return;
        }
      }

      setActiveMoment(null);
    };

    checkMoments();
  }, [
    stats.streak,
    stats.xp,
    stats.lastSeen,
    stats.level,
    stats.xpToNextLevel,
  ]);

  const dismiss = async (type: MomentType) => {
    const today = new Date().toDateString();
    if (type === "STREAK")
      await AsyncStorage.setItem(DISMISSED_KEYS.STREAK, today);
    if (type === "XP_PROGRESS")
      await AsyncStorage.setItem(DISMISSED_KEYS.XP, today);

    setActiveMoment(null);
  };

  return { activeMoment, extraData, dismiss };
};
