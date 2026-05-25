import { View } from "react-native";
import SkeletonText from "../ui/skeleton/SkeletonText";

export const PlanSkeleton = () => (
  <View className="p-5 mb-4 rounded-2xl border border-gray-700 bg-gray-900/60">
    <View className="mb-4">
      <SkeletonText height={18} width={"60%"} />
    </View>

    <View className="mb-5">
      <SkeletonText height={14} width={"40%"} />
    </View>

    <View>
      <View className="mb-3">
        <SkeletonText height={12} width={"90%"} />
      </View>

      <View className="mb-3">
        <SkeletonText height={12} width={"80%"} />
      </View>

      <View>
        <SkeletonText height={12} width={"85%"} />
      </View>
    </View>
  </View>
);
