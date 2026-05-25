import { DoorOpen, MessageCircle, Tv } from "lucide-react-native";
import React, { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../ui/Text";

export default function FeatureHighlights() {
  const features: {
    number: number;
    icon: ReactNode;
    title: string;
    description: string;
  }[] = [
    {
      number: 1,
      icon: <Tv size={28} color="#f44034" />,
      title: "Pick a show",
      description: "Browse what's on live right now or search for any show",
    },
    {
      number: 2,
      icon: <DoorOpen size={28} color="#f44034" />,
      title: "Join a room",
      description: "Jump into an active room or start a new one",
    },
    {
      number: 3,
      icon: <MessageCircle size={28} color="#f44034" />,
      title: "Chat with fans",
      description: "React, debate, and celebrate together in real-time",
    },
  ];

  return (
    <View className="flex-1  px-6 py-10 justify-center ">
      <View className="space-y-10">
        {features.map((feature) => (
          <TouchableOpacity
            key={feature.number}
            activeOpacity={0.8}
            className="items-center"
          >
            <View className="relative mb-4">
              <View className="w-[55px] h-[55px] rounded-2xl bg-secondary/5 items-center justify-center">
                <View>{feature.icon}</View>
              </View>
              <View className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary items-center justify-center">
                <Text variant="bold" className="text-white text-sm">
                  {feature.number}
                </Text>
              </View>
            </View>

            <Text variant="semibold" className="text-white text-xl mb-2">
              {feature.title}
            </Text>
            <Text className="text-muted-foreground text-center text-[14px] leading-6 max-w-[300px] mx-auto mb-10">
              {feature.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
