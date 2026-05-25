import { PRIMARY_COLOR } from "@/constants/constants";
import { RefreshCcw } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { Button } from "../common/Button";
import { Text } from "./Text";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  buttonText?: string;
  onButtonPress?: () => void;
  className?: string;
  buttonIcon?: React.ReactNode;
  loading?: boolean;
}

export default function EmptyState({
  title,
  description,
  icon,
  buttonText,
  onButtonPress,
  buttonIcon = <RefreshCcw color="#fff" size={20} />,
  className = "",
  loading,
}: EmptyStateProps) {
  return (
    <View className={`items-center justify-center px-6 py-6 ${className}`}>
      {icon && <View className="mb-4">{icon}</View>}

      <Text className="text-xl text-white text-center mb-2">{title}</Text>
      {description && (
        <Text className="text-sm text-gray-400 text-center mb-6 leading-5">
          {description}
        </Text>
      )}
      {buttonText && onButtonPress && (
        <Button
          icon={buttonIcon}
          style={{ backgroundColor: PRIMARY_COLOR }}
          onPress={onButtonPress}
          isLoading={loading}
          className="px-6 py-3 rounded-xl"
        >
          {buttonText}
        </Button>
      )}
    </View>
  );
}
