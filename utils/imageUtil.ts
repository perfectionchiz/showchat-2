import { ImageSourcePropType } from "react-native";

const PLACEHOLDER_IMAGE = require("../assets/images/placeholder.jpg");

export function getSafeImageSource(
  uri?: string | null,
  fallback: ImageSourcePropType = PLACEHOLDER_IMAGE,
): ImageSourcePropType {
  if (!uri || typeof uri !== "string" || uri.trim() === "") {
    return fallback;
  }

  try {
    new URL(uri);
    return { uri };
  } catch {
    return fallback;
  }
}

export function getSafePosterSource(
  posterUrl?: string | null,
  placeholder: ImageSourcePropType = PLACEHOLDER_IMAGE,
): ImageSourcePropType {
  if (!posterUrl || typeof posterUrl !== "string") {
    return placeholder;
  }

  const trimmed = posterUrl.trim();

  if (
    trimmed === "" ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:") ||
    trimmed.length < 10 ||
    !trimmed.match(/^https?:\/\//i)
  ) {
    return placeholder;
  }

  return { uri: trimmed };
}
