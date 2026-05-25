import { cn } from "@/utils/helper";
import { Text as RNText, TextProps } from "react-native";

type Variant = "light" | "regular" | "medium" | "semibold" | "bold";

interface AppTextProps extends TextProps {
  variant?: Variant;
  className?: string;
}

export function Text({
  variant = "regular",
  className,
  style,
  ...props
}: AppTextProps) {
  const fontMap: Record<Variant, string> = {
    light: "DMSans-Light",
    regular: "DMSans-Regular",
    medium: "DMSans-Medium",
    semibold: "DMSans-SemiBold",
    bold: "DMSans-Bold",
  };

  return (
    <RNText
      className={cn("text-foreground", className)}
      style={[{ fontFamily: fontMap[variant] }, style]}
      {...props}
    />
  );
}
