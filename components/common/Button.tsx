import { cn } from "@/utils/helper";

import { useHaptic } from "@/hooks/useHaptic";
import { useUserPreferences } from "@/hooks/user-preference/useUserPreference";
import React from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { Text } from "../ui/Text";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "tertiary"
  | "link";

type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends Omit<TouchableOpacityProps, "onPress"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
  className?: string;
  textClassName?: string;
  textVariant?: "light" | "regular" | "medium" | "semibold" | "bold";
  textStyles?: StyleProp<TextStyle>;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary border-primary",
  secondary: "bg-secondary border-secondary",
  outline: "border border-input bg-transparent",
  ghost: "bg-transparent",
  destructive: "bg-destructive border-destructive",
  tertiary: "bg-tertiary",
  link: "bg-transparent",
};

const textVariantStyles: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-white",
  outline: "text-foreground",
  ghost: "text-foreground",
  destructive: "text-destructive-foreground",
  tertiary: "text-white",
  link: "text-primary underline",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 rounded-md",
  md: "h-12 px-4 rounded-md",
  lg: "h-[50px] px-8 rounded-lg",
  icon: "h-10 w-10 p-0 rounded-full",
};

const textSizeStyles: Record<ButtonSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  icon: "",
};

const disabledStyles = "opacity-50";

const baseButtonStyles =
  "flex flex-row items-center justify-center gap-2 font-medium ";

export function Button({
  variant = "primary",
  size = "md",
  isLoading,
  disabled = false,
  fullWidth = false,
  icon,
  rightIcon,
  children,
  onPress,
  className = "",
  textClassName = "",
  style,
  textVariant = "medium",
  textStyles,
  ...props
}: ButtonProps) {
  const hapticSelection = useHaptic("success");
  const loading = isLoading;
  const { data: preferences } = useUserPreferences();
  const isSilentMode = preferences?.silent_mode_default;
  const isIconOnly = size === "icon" && !children;

  const buttonClasses = cn(
    baseButtonStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full",
    (disabled || loading) && disabledStyles,
    className,
  );

  const textClasses = cn(
    "font-medium",
    textVariantStyles[variant],
    textSizeStyles[size],
    textClassName,
  );

  const handlePress = (e: GestureResponderEvent) => {
    if (!isSilentMode) {
      hapticSelection?.();
    }
    if (disabled || loading) return;

    onPress?.(e);
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={handlePress}
      className={buttonClasses}
      style={style}
      {...props}
    >
      <>
        {icon && <View>{icon}</View>}
        {!isIconOnly && children && (
          <Text
            style={textStyles}
            variant={textVariant}
            className={textClasses}
          >
            {children}
          </Text>
        )}
        {rightIcon && <View>{rightIcon}</View>}
      </>
      {loading && <ActivityIndicator color={"#fff"} size="small" />}
    </TouchableOpacity>
  );
}
