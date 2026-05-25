export const VIBES = {
  NO_SPOILERS: { label: "No Spoilers", emoji: "🔒" },
  SPOILERS: { label: "Spoilers", emoji: "⚠️" },
  SPOILER_DISCUSSION: { label: "Spoiler Discussion", emoji: "💬" },
  SPOILER_FREE_ZONE: { label: "Spoiler Free", emoji: "🚫" },

  CHILL: { label: "Chill", emoji: "😌" },
  HYPE: { label: "Hype", emoji: "🔥" },
  FUNNY: { label: "Funny", emoji: "😂" },
  EMOTIONAL: { label: "Emotional", emoji: "🥹" },
  SERIOUS: { label: "Serious", emoji: "🧠" },
  DARK: { label: "Dark", emoji: "🌑" },
  LIGHT_HEARTED: { label: "Light-hearted", emoji: "🌤️" },
  WHOLESOME: { label: "Wholesome", emoji: "💖" },
  ROMANTIC: { label: "Romantic", emoji: "❤️" },
  INTENSE: { label: "Intense", emoji: "⚡" },

  LOW_ENERGY: { label: "Low Energy", emoji: "🫠" },
  MEDIUM_ENERGY: { label: "Medium Energy", emoji: "🙂" },
  HIGH_ENERGY: { label: "High Energy", emoji: "⚡🔥" },
  CHAOS: { label: "Chaos", emoji: "💥" },
  CALM: { label: "Calm", emoji: "🧘" },
  RELAXED: { label: "Relaxed", emoji: "🛋️" },
  TRENDING: { label: "Trending", emoji: "📈" },
  VIRAL: { label: "Viral", emoji: "🚀" },
  LOW_ACTIVITY: { label: "Low Activity", emoji: "🌙" },
  ACTIVE: { label: "Active", emoji: "💬" },
  OVERFLOWING_CHAT: { label: "Overflowing", emoji: "🗯️" },
  QUIET_ROOM: { label: "Quiet", emoji: "🤫" },

  MIND_BENDING: { label: "Mind-bending", emoji: "🌀" },
  CONFUSING: { label: "Confusing", emoji: "😵" },
  DEEP: { label: "Deep", emoji: "🌊" },
  PHILOSOPHICAL: { label: "Philosophical", emoji: "📚" },
  PLOT_TWIST: { label: "Plot Twist", emoji: "😲" },
  BINGE_WORTHY: { label: "Binge-worthy", emoji: "🍿" },
  REWATCHABLE: { label: "Rewatchable", emoji: "🔁" },
  CLUTCH_MOMENT: { label: "Clutch Moment", emoji: "⏱️" },
  CLIFFHANGER: { label: "Cliffhanger", emoji: "😬" },
  SLOW_BURN: { label: "Slow Burn", emoji: "🐢" },
  FAST_PACED: { label: "Fast-paced", emoji: "🏃" },

  MEMEABLE: { label: "Memeable", emoji: "🫵😂" },
  UNHINGED: { label: "Unhinged", emoji: "🤪" },
  CRINGE: { label: "Cringe", emoji: "😬" },
  DRAMA: { label: "Drama", emoji: "🎭" },
  CONTROVERSIAL: { label: "Controversial", emoji: "⚖️" },
  NEWLY_CREATED: { label: "New", emoji: "🆕" },
  CURATED: { label: "Curated", emoji: "🧾" },
  EDITOR_PICK: { label: "Editor’s Pick", emoji: "⭐" },
  RECOMMENDED: { label: "Recommended", emoji: "👍" },
  HIDDEN_GEM: { label: "Hidden Gem", emoji: "💎" },
} as const;
export const normalizeVibeKey = (vibe?: string) => {
  if (!vibe) return "";

  return vibe
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
};
export const resolveVibe = (vibe?: string) => {
  if (!vibe) return { label: "Unknown", emoji: "❓" };

  const key = normalizeVibeKey(vibe) as keyof typeof VIBES;

  return (
    VIBES[key] ?? {
      label: vibe,
      emoji: "✨",
    }
  );
};
