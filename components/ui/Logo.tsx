import { GradientText } from "@/components/common/GradientText";
import { Radio } from "lucide-react-native";
import React from "react";
import { Platform, Text as RNText, View, ViewStyle } from "react-native";

interface LogoProps {
  size?: number;
  iconSize?: number;
  showText?: boolean;
  style?: ViewStyle;
  fontClassName?: string;
}

export default function Logo({
  size = 50,
  iconSize = 25,
  showText = true,
  style,
  fontClassName = "text-4xl",
}: LogoProps) {
  const shadowStyle: ViewStyle = {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  };

  return (
    <View style={style} className="flex flex-row items-center justify-center">
      <View
        style={[shadowStyle, { width: size, height: size }]}
        className="flex items-center justify-center bg-secondary rounded-2xl"
      >
        <Radio size={iconSize} color="#fff" />
      </View>

      {showText && (
        <>
          {Platform.OS === "web" ? (
            <View className="ml-3">
              <RNText
                style={
                  {
                    backgroundImage:
                      "linear-gradient(to right, #f44034, #0078ff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "inline-block",
                  } as any
                }
                className={`${fontClassName} font-bold`}
              >
                Show Chats
              </RNText>
            </View>
          ) : (
            <GradientText
              textVariant="bold"
              className={`${fontClassName} ml-3`}
            >
              Show Chats
            </GradientText>
          )}
        </>
      )}
    </View>
  );
}
