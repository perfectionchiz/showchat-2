import { ChevronDown, MessageSquare, Pin, PinOff } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../ui/Text";

export type PinnedMessage = {
  id: string;
  display_name: string;
  message: string;
};

type Props = {
  message: PinnedMessage;
  onUnpin?: (id: string) => void;
  onGoToMessage?: (id: string) => void;
  isPrivate?: boolean;
};

export const PinnedMessageBar: React.FC<Props> = ({
  message,
  onUnpin,
  onGoToMessage,
  isPrivate,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <View>
      <View className="overflow-hidden  border border-white/5 bg-[#0f172a] shadow-lg">
        <TouchableOpacity
          onPress={() => setOpen((prev) => !prev)}
          activeOpacity={0.9}
          className="flex-row items-center justify-between px-3 py-2.5"
        >
          <View className="absolute left-0 top-2 bottom-2 w-[3px] bg-yellow-500 rounded-r-full" />

          <View className="flex-row items-center flex-1 gap-3 ml-1">
            <Pin size={20} color="#facc15" fill="#facc15" />

            <View className="flex-1">
              <Text className="text-[10px] text-white font-bold tracking-widest uppercase">
                Pinned Message
              </Text>
              <Text numberOfLines={1} className="text-white text-xs mt-0.5">
                <Text className="text-gray-200 font-semibold">
                  {message.display_name}
                </Text>
                <Text className="text-gray-400">: {message.message}</Text>
              </Text>
            </View>
          </View>

          <View className={`p-1 rounded-full ${open ? "bg-white/10" : ""}`}>
            <ChevronDown
              size={16}
              color="#94a3b8"
              style={{
                transform: [{ rotate: open ? "180deg" : "0deg" }],
              }}
            />
          </View>
        </TouchableOpacity>

        {open && (
          <View className="flex-row items-center border-t border-white/5 bg-black/20">
            <TouchableOpacity
              onPress={() => onGoToMessage?.(message.id)}
              className="flex-1 flex-row items-center justify-center py-3 gap-2 border-r border-white/5"
            >
              <MessageSquare size={14} color="#6366f1" />
              <Text className="text-white text-xs font-semibold">
                View Message
              </Text>
            </TouchableOpacity>

            {isPrivate && (
              <TouchableOpacity
                onPress={() => onUnpin?.(message.id)}
                className="flex-1 flex-row items-center justify-center py-3 gap-2"
              >
                <PinOff size={14} color="#ef4444" />
                <Text className="text-red-400 text-xs font-semibold">
                  Unpin
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};
