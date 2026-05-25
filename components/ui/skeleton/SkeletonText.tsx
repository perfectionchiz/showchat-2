import { Skeleton } from "moti/skeleton";
import React, { memo } from "react";
import { DimensionValue } from "react-native";
import { Easing } from "react-native-reanimated"; // Use Reanimated's easing

export type SkeletonTextProps = {
  width?: DimensionValue;
  height: number;
};

const SkeletonText = ({ width = "100%", height }: SkeletonTextProps) => {
  return (
    <Skeleton
      width={width}
      height={height}
      colorMode="dark"
      transition={{
        type: "timing",
        duration: 1500,
        easing: Easing.linear,
      }}
      colors={["#1c1c2e", "#2a2a3d", "#1c1c2e"]}
      radius={8}
    />
  );
};

export default memo(SkeletonText);
