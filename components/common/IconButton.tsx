import React from "react";
import {
  GestureResponderEvent,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

type IconButtonProps = {
  icon: React.ReactNode;
  onPress: (e: GestureResponderEvent) => void;
  size?: number;
  style?: ViewStyle;
  disabled?: boolean;
  className?: string;
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 40,
  style,
  disabled = false,
  className,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          width: size,
          height: size,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
      className={className}
    >
      {icon}
    </TouchableOpacity>
  );
};
