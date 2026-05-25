import { useHaptic } from "@/hooks/useHaptic";
import { cn } from "@/utils/helper";
import { Eye, EyeOff, X } from "lucide-react-native";
import React, { forwardRef, useState } from "react";
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "../ui/Text";

type InputVariant = "default" | "error" | "success";
type InputSize = "sm" | "default" | "lg";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  variant?: InputVariant;
  size?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  wrapperStyle?: ViewStyle;
  secureTextEntryToggle?: boolean;
  disabled?: boolean;
  showClearButton?: boolean;
  textarea?: boolean;
  onClear?: () => void;
}

const baseInputStyles =
  "w-full bg-[#20283c] border-0 border-input rounded-md py-4 px-3 text-foreground placeholder:text-muted-foreground";

const variantStyles: Record<InputVariant, string> = {
  default: "border-input",
  error: "border-destructive",
  success: "border-green-500",
};

const disabledStyles = "opacity-60 bg-muted/50";
const iconContainerStyles = "absolute px-3";

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      variant = "default",
      leftIcon,
      rightIcon,
      containerClassName = "",
      inputClassName = "",
      labelClassName = "",
      errorClassName = "",
      wrapperStyle,
      secureTextEntry: initialSecure = false,
      secureTextEntryToggle = false,
      showClearButton = false,
      value = "",
      onChangeText,
      onClear,
      disabled = false,
      placeholder,
      textarea = false,
      ...props
    },
    ref,
  ) => {
    const [secureTextEntry, setSecureTextEntry] = useState(initialSecure);
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = !!value;
    const showEye = secureTextEntryToggle && !textarea;
    const showClear = showClearButton && hasValue && !disabled;
    const hapticTyping = useHaptic("light");
    const inputClasses = cn(
      baseInputStyles,
      variantStyles[variant],
      disabled && disabledStyles,
      leftIcon && "pl-10",
      (rightIcon || showEye || showClear) && "pr-10",
      textarea && "h-32 pt-3",
      inputClassName,
    );

    const containerClasses = cn("relative", containerClassName);

    return (
      <View className=" gap-1.5" style={wrapperStyle}>
        {label && (
          <Text
            variant="medium"
            className={cn("text-sm text-white", labelClassName)}
          >
            {label}
          </Text>
        )}

        <View className={containerClasses}>
          {leftIcon && !textarea && (
            <View
              style={{ zIndex: 100, top: 14 }}
              className={cn(iconContainerStyles, "left-0")}
            >
              {leftIcon}
            </View>
          )}

          <TextInput
            ref={ref}
            className={inputClasses}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            value={value}
            onChangeText={(text) => {
              onChangeText?.(text);
            }}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => setIsFocused(false)}
            secureTextEntry={showEye ? secureTextEntry : false}
            editable={!disabled}
            multiline={textarea}
            numberOfLines={textarea ? 4 : 1}
            textAlignVertical={textarea ? "top" : "center"}
            accessibilityLabel={label || placeholder}
            accessibilityState={{ disabled }}
            style={
              {
                outlineStyle: "none",
              } as any
            }
            {...props}
          />
          <View className="flex-1">
            {error && (
              <Text
                className={cn("text-sm  text-red-600 mt-1 ", errorClassName)}
              >
                {error}
              </Text>
            )}
          </View>
          {!textarea && (
            <View className="absolute right-2 top-5 flex-row items-center pr-2 gap-1">
              {showClear && (
                <TouchableOpacity onPress={onClear} hitSlop={12}>
                  <X size={18} color="#6b7280" />
                </TouchableOpacity>
              )}

              {showEye && (
                <TouchableOpacity
                  onPress={() => setSecureTextEntry((prev) => !prev)}
                  hitSlop={12}
                >
                  {secureTextEntry ? (
                    <EyeOff size={18} color="#6b7280" />
                  ) : (
                    <Eye size={18} color="#6b7280" />
                  )}
                </TouchableOpacity>
              )}

              {rightIcon && !showEye && !showClear && rightIcon}
            </View>
          )}
        </View>
      </View>
    );
  },
);

Input.displayName = "Input";
export { Input };

