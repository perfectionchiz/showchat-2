import { ChevronRight } from "lucide-react-native";
import { JSX } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { Text } from "../ui/Text";
type SettingsItemProps = {
  icon: JSX.Element;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  showBorder?: boolean;
};
export const SettingsItem = ({
  icon,
  label,
  onPress,
  showChevron = true,
  className = "",
  loading = false,
  disabled = false,
  showBorder = true,
}: SettingsItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-between py-4 ${showBorder ? "border-b" : ""} border-gray-800 ${
        disabled || loading ? "opacity-50" : "active:opacity-70"
      } ${className}`}
    >
      <View className="flex-row items-center gap-4">
        {icon}
        <Text variant="medium" className="text-white text-base">
          {label}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#f87171" />
      ) : (
        showChevron && <ChevronRight size={20} color="#95A3B8" />
      )}
    </TouchableOpacity>
  );
};
