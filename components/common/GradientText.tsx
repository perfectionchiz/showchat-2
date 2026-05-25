import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { TextProps } from "react-native";
import { Text } from "../ui/Text";

interface GradientTextProps extends TextProps {
  children: React.ReactNode;
  textVariant?: "light" | "regular" | "medium" | "semibold" | "bold";
  colors?: any;
}
export function GradientText({
  children,
  style,
  textVariant,
  colors = ["hsl(4, 90%, 58%)", "hsl(210, 100%, 56%)"],
  ...props
}: GradientTextProps) {
  return (
    <MaskedView
      maskElement={
        <Text
          variant={textVariant}
          {...props}
          style={[style, { backgroundColor: "transparent" }]}
        >
          {children}
        </Text>
      }
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text variant={textVariant} {...props} style={[style, { opacity: 0 }]}>
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}
