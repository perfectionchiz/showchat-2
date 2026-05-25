import { cn } from "@/utils/helper";
import React from "react";
import { View } from "react-native";
import { Text } from "../ui/Text";

type BadgeVariant = "default" | "secondary" | "destructive";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  textClassName?: string;
}

const variantStyles = {
  default: "bg-primary/20",
  secondary: "bg-blue-500",
  destructive: "bg-red-500/20",
};

export function Badge({
  children,
  variant = "default",
  className,
  textClassName,
}: BadgeProps) {
  return (
    <View
      className={cn(
        "px-5 py-1 rounded-full items-center justify-center",
        variantStyles[variant],
        className,
      )}
    >
      <Text
        variant="semibold"
        className={cn("text-sm text-white", textClassName)}
      >
        {children}
      </Text>
    </View>
  );
}
