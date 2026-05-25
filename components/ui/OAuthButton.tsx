import { useOAuth } from "@/hooks/auth/useOAuth";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform } from "react-native";
import { Button } from "../common/Button";

type OAuthProvider = "google" | "apple";

interface OAuthButtonProps {
  provider: OAuthProvider;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

export function OAuthButton({
  provider,
  fullWidth = true,
  size = "lg",
}: OAuthButtonProps) {
  const { signInWithGoogle, signInWithApple, isGoogleLoading, isAppleLoading } =
    useOAuth();

  let icon = null;
  let label = "";
  let bgColor = "";

  switch (provider) {
    case "google":
      icon = <Ionicons name="logo-google" size={20} color="#fff" />;
      label = "Continue with Google";
      bgColor = "bg-[#0B111E]";
      break;

    case "apple":
      icon = <Ionicons name="logo-apple" size={20} color="#fff" />;
      label = "Continue with Apple";
      bgColor = "bg-[#000]";
      break;
  }

  const handlePress = async () => {
    if (provider === "google") {
      signInWithGoogle();
    } else {
      signInWithApple();
    }
  };

  const loading = provider === "google" ? isGoogleLoading : isAppleLoading;

  return (
    <Button
      icon={icon}
      onPress={handlePress}
      fullWidth={fullWidth}
      size={size}
      disabled={loading}
      isLoading={loading}
      textClassName={`${Platform.OS === "web" ? "text-sm" : ""}`}
      className={`border border-gray-800 gap-3 ${bgColor}`}
      variant="tertiary"
    >
      {label}
    </Button>
  );
}
