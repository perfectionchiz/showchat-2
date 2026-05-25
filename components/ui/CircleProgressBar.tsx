import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

interface CircleProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  textColor?: string;
  showPercentage?: boolean;
  textSize?: number;
  percentSize?: number;
  step?: number;
}

export default function CircleProgress({
  progress = 0,
  size = 70,
  strokeWidth = 3,
  color = "#4CAF50",
  backgroundColor = "#E0E0E0",
  textColor = "#fff",
  showPercentage = true,
  textSize,
  percentSize,
  step,
}: CircleProgressProps) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const strokeDashoffset = circumference - (safeProgress / 100) * circumference;

  const computedTextSize = textSize ?? size * 0.4;
  const computedPercentSize = percentSize ?? size * 0.22;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>

      {showPercentage && (
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.percentageText,
              { color: textColor, fontSize: computedTextSize },
            ]}
          >
            {step}
            <Text
              className="text-muted-foreground"
              style={[styles.percentSign, { fontSize: computedPercentSize }]}
            ></Text>
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  percentageText: {
    fontWeight: "600",
    includeFontPadding: false,
    textAlign: "center",
  },
  percentSign: {
    fontWeight: "500",
  },
});
