import { Skeleton } from "moti/skeleton";
import React, { memo } from "react";
import { Easing } from "react-native-reanimated";

type SkeletonCircleProps = {
  size?: number;
};

const SkeletonCircle = ({ size = 50 }: SkeletonCircleProps) => {
  return (
    <Skeleton
      colorMode="dark"
      transition={{
        type: "timing",
        duration: 1500,
        easing: Easing.linear,
      }}
      colors={["#1c1c2e", "#2a2a3d", "#1c1c2e"]}
      width={size}
      height={size}
      radius="round"
    />
  );
};

export default memo(SkeletonCircle);
