const badgeMap: Record<string, any> = {
  viewer: require("@/assets/images/badges/viewer.webp"),
  newbie: require("@/assets/images/badges/badge-3.png"),
  member: require("@/assets/images/badges/badge-1.webp"),
  regular: require("@/assets/images/badges/badge-3.png"),
  active: require("@/assets/images/badges/badge-3.png"),
  streak_3: require("@/assets/images/badges/badge-4.png"),
  streak_7: require("@/assets/images/badges/badge-5.webp"),
  streak_30: require("@/assets/images/badges/badge-5.webp"),
  early_bird: require("@/assets/images/badges/badge-2.png"),
  night_owl: require("@/assets/images/badges/badge-6.webp"),
  commenter: require("@/assets/images/badges/badge-6.webp"),
  creator: require("@/assets/images/badges/badge-7.webp"),
  devotee: require("@/assets/images/badges/badge-7.webp"),
  top_fan: require("@/assets/images/badges/badge-8.png"),
  veteran: require("@/assets/images/badges/badge-8.png"),
  supporter: require("@/assets/images/badges/badge-9.webp"),
  moderator: require("@/assets/images/badges/badge-9.webp"),
  admin: require("@/assets/images/badges/badge-10.webp"),
  legend: require("@/assets/images/badges/badge-2.png"),
  founder: require("@/assets/images/badges/badge-10.webp"),
};

export const getBadgeGem = (type: string) => {
  return badgeMap[type.toLowerCase()] ?? badgeMap.viewer;
};
