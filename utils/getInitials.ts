const warmColors = [
  "#334155", // slate (base neutral)
  "#475569", // cool gray
  "#1E293B", // deep slate
  "#1E3A8A", // muted royal blue
  "#2563EB", // soft blue
  "#3B82F6", // balanced blue
  "#0EA5E9", // sky blue
  "#14B8A6", // teal
  "#10B981", // green
  "#22C55E", // fresh green
  "#84CC16", // lime (controlled)
  "#F59E0B", // amber
  "#F97316", // orange
  "#EA580C", // deep orange
  "#6366F1", // indigo (soft purple-blue balance)
];
const nameColors = [
  "#f59e0b", // amber
  "#ea580c", // orange
  "#c2410c", // deep orange
  "#b45309", // amber dark
  "#d97706", // gold
  "#fbbf24", // bright amber
  "#f97316", // orange bright
  "#e11d48", // rose
  "#be123c", // rose dark
  "#9f1239", // deep rose
  "#c026d3", // fuchsia
  "#a21caf", // purple
  "#7e22ce", // violet
  "#6b21a8", // deep violet
  "#4338ca", // indigo
  "#6366f1", // indigo bright
  "#4f46e5", // royal blue
  "#1e40af", // blue
  "#0e7490", // cyan
  "#0f766e", // teal
  "#14b8a6", // teal bright
  "#10b981", // emerald
  "#059669", // emerald dark
  "#15803d", // green
  "#ca8a04", // yellow dark
  "#b45309", // warm gold
];
export function getInitials(name?: string | null) {
  if (!name) return "";

  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
}

export const getColorFromInitials = (initials: string): string => {
  if (!initials) return warmColors[0];

  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % warmColors.length;
  return warmColors[index];
};

export const getColorFromName = (displayName: string): string => {
  if (!displayName) return nameColors[0];

  let hash = 0;
  const str = displayName.trim().toLowerCase();

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % nameColors.length;
  return nameColors[index];
};
export const getGradientFromName = (displayName: string): [string, string] => {
  if (!displayName) return ["#f59e0b", "#d97706"];

  let hash = 0;
  const str = displayName.trim().toLowerCase();

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % nameColors.length;
  const baseColor = nameColors[index];

  const secondaryColor = nameColors[(index + 1) % nameColors.length];

  return [baseColor, secondaryColor];
};
