import { formatViewers } from "@/utils/formatViewer";
import { Users2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Avatar } from "../common/Avatar";
import { Button } from "../common/Button";
import { Text } from "../ui/Text";

interface Props {
  viewers?: number;
  participantAvatars?: string[];
  onPress?: () => void;
  disabled?: boolean;
  rounded?: boolean;
  isGuide?: boolean;
}

export function LiveCardFooter({
  viewers = 0,
  participantAvatars = [],
  onPress,
  disabled,
  rounded,
  isGuide,
}: Props) {
  const [liveViewers, setLiveViewers] = useState(viewers);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers((prev) => {
        const change = Math.floor(Math.random() * 5);
        const increase = Math.random() > 0.5;

        return increase ? prev + change : Math.max(0, prev - change);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  const VIBES = [
    { emoji: "😂", label: "Banter" },
    { emoji: "🧐", label: "Serious" },
  ];
  return (
    <View className="flex-row justify-between border-t border-gray-800 px-6 pt-4 items-center mb-3">
      <View className="flex-row items-center gap-1">
        <Users2 fill="#d1d5db" color="#fff" size={20} />
        <Text variant="medium" className="text-white">
          {formatViewers(liveViewers)}
        </Text>

        <View className="flex-row items-center">
          {participantAvatars.slice(0, 3).map((uri, i) => (
            <Avatar
              key={i}
              name={uri}
              size={24}
              className={i > 0 ? "-ml-2" : ""}
            />
          ))}
        </View>
        {isGuide && (
          <View>
            {
              <View className="flex-row ml-1 items-center mr-2">
                {VIBES.slice(0, 2).map((r, i) => (
                  <Text key={i} className="text-lg mr-1">
                    {r.emoji}
                  </Text>
                ))}
              </View>
            }
          </View>
        )}
      </View>

      <Button
        className={"w-[110px] rounded-2xl"}
        size="sm"
        onPress={onPress}
        variant="secondary"
        textVariant="semibold"
        disabled={disabled}
      >
        Join Chat
      </Button>
    </View>
  );
}
