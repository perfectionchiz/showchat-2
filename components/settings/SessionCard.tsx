import { PRIMARY_COLOR } from "@/constants/constants";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { Platform, TouchableOpacity, View } from "react-native";

import { IconButton } from "../common/IconButton";
import { Text } from "../ui/Text";

const getIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case "mobile":
      return "cellphone";
    case "tablet":
      return "tablet";
    case "desktop":
      return "laptop";
    default:
      return "devices";
  }
};

export const SessionCard = ({
  device,
  isCurrent = false,
  onDelete,
}: {
  device: any;
  isCurrent?: boolean;
  onDelete?: (id: string) => void;
}) => {
  const dynamicStyle = {
    borderColor: isCurrent ? PRIMARY_COLOR : "#1f2937",
    borderWidth: isCurrent ? 2 : 1,
    backgroundColor: "#111827",

    ...Platform.select({
      ios: {
        shadowColor: isCurrent ? PRIMARY_COLOR : "#000",
        shadowOpacity: isCurrent ? 0.4 : 0.1,
        shadowRadius: isCurrent ? 12 : 4,
        shadowOffset: { width: 0, height: 0 },
      },
      android: {
        elevation: isCurrent ? 8 : 2,
      },
      web: {
        boxShadow: isCurrent
          ? `0px 0px 15px ${PRIMARY_COLOR}66`
          : "0px 4px 6px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
      },
    }),
  };
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        {
          padding: 16,
          borderRadius: 12,
          borderWidth: 1.5,
        },
        dynamicStyle,
      ]}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-row flex-1">
          <View
            className={`w-12 h-12 rounded-2xl items-center justify-center ${
              isCurrent ? "bg-blue-500/15" : "bg-[#232833]"
            }`}
          >
            <MaterialCommunityIcons
              name={getIcon(device.device_type) as any}
              size={20}
              color={isCurrent ? PRIMARY_COLOR : "#fff"}
            />
          </View>

          <View className="ml-3 flex-1 pr-2">
            <View className="flex-row items-center">
              <Text
                variant="semibold"
                numberOfLines={1}
                className="text-white text-base flex-1"
              >
                {device.device_name || "Unknown Device"}
              </Text>
            </View>

            <View className="flex-row items-center mt-1.5">
              <Ionicons name="location-outline" size={13} color="#95A3B8" />

              <Text
                numberOfLines={1}
                className="text-muted-foreground text-sm ml-1"
              >
                {device.location || "Unknown Location"}
              </Text>
            </View>

            <Text className="text-gray-400 text-xs mt-2">
              {isCurrent
                ? "Active now"
                : `Last active ${formatDistanceToNow(
                    new Date(device.last_active),
                  )} ago`}
            </Text>
          </View>
        </View>

        {!isCurrent && (
          <IconButton
            onPress={() => onDelete?.(device.id)}
            className="bg-white/5 rounded-full"
            icon={<Ionicons name="close" size={16} color="#95A3B8" />}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};
