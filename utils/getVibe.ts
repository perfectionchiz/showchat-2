const vibeMap: Record<string, string> = {
  hype: "🔥",
  fun: "😂",
  chill: "😌",
  toxic: "⚠️",
  love: "❤️",
  intense: "😳",
  boring: "😴",
};
export const getVibeEmoji = (vibe?: string | null) => {
  if (!vibe) return "🙂";
  return vibeMap[vibe] || "🙂";
};
