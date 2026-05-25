import { ArrowLeft } from "lucide-react-native";
import { Platform, Text, View } from "react-native";
import { IconButton } from "../common/IconButton";

interface SettingsHeaderProps {
  back: () => void;
  children: React.ReactNode;
  extraChild?: React.ReactNode;
  showBorder?: boolean;
}

export const SettingsHeader = ({
  back,
  children,
  extraChild,
  showBorder = true,
}: SettingsHeaderProps) => {
  return (
    <View
      className={`flex-row items-center  p-3 ${showBorder && "border-b"} border-gray-800 ${
        extraChild ? "justify-between" : "justify-start"
      }`}
    >
      <IconButton
        size={40}
        icon={<ArrowLeft size={22} color="white" />}
        onPress={back}
      />
      <Text
        className={`text-white ${Platform.OS === "web" ? "text-xl" : "text-xl"} font-semibold ${
          !extraChild ? "flex-1 text-center mx-4" : "mx-4"
        }`}
      >
        {children}
      </Text>

      {extraChild ? <View>{extraChild}</View> : <View style={{ width: 40 }} />}
    </View>
  );
};
