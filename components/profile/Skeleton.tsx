import { View } from "react-native";
import SkeletonCircle from "../ui/skeleton/SkeletonCircle";
import SkeletonText from "../ui/skeleton/SkeletonText";

export const Skeleton = () => {
  return (
    <View className="bg-primary px-5 py-4 rounded-2xl border border-gray-800 mt-6">
      <View className="flex-row items-center justify-between">
        <View>
          <SkeletonText width={60} height={10} />
          <View className="mt-2">
            <SkeletonText width={140} height={16} />
          </View>
        </View>
        <SkeletonCircle size={40} />
      </View>
      <View className="mt-4">
        <SkeletonText width={180} height={10} />
      </View>
      <View className="flex-row items-center justify-between mt-4">
        <View>
          <SkeletonText width={50} height={10} />
          <View className="mt-2">
            <SkeletonText width={40} height={14} />
          </View>
        </View>
        <View>
          <SkeletonText width={50} height={10} />
          <View className="mt-2">
            <SkeletonText width={40} height={14} />
          </View>
        </View>
      </View>
      <View className="mt-5 flex-row gap-2">
        <SkeletonText width={60} height={24} />
        <SkeletonText width={60} height={24} />
        <SkeletonText width={60} height={24} />
      </View>
    </View>
  );
};
