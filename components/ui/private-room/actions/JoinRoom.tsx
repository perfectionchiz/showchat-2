import { Button } from "@/components/common/Button";
import FallbackImage from "@/components/ui/FallbackImage";
import { Text } from "@/components/ui/Text";
import { getInitials } from "@/utils/getInitials";
import React from "react";
import { Modal, View } from "react-native";

type Props = {
  visible: boolean;
  room?: {
    id: string;
    name?: string;
    image_url?: string;
  } | null;
  onClose: () => void;
  isLoading: boolean;
};

export const JoinRoom: React.FC<Props> = ({
  visible,
  room,
  onClose,
  isLoading,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/80 justify-center items-center px-6">
        <View className="bg-background w-full rounded-[20px] p-6 shadow-2xl border border-white/5">
          <View className="items-center mb-6">
            <View className="w-20 h-20 bg-white rounded-3xl items-center justify-center mb-4 shadow-inner border border-white/10 overflow-hidden">
              {room?.image_url ? (
                <FallbackImage uri={room.image_url} className="w-full h-full" />
              ) : (
                <Text variant="bold" className="text-black text-2xl">
                  {getInitials(room?.name || "R")}
                </Text>
              )}
            </View>

            <Text
              variant="semibold"
              className="text-muted-foreground text-xs  uppercase tracking-wider mb-1"
            >
              You&apos;ve been invited to join
            </Text>
            <Text className="text-white text-2xl font-bold text-center">
              {room?.name || "Private Room"}
            </Text>
          </View>

          <View className="gap-3">
            <Button
              isLoading={isLoading}
              variant="secondary"
              className=" rounded-md"
              onPress={onClose}
            >
              <Text className="text-white font-bold text-base">
                Accept Invite
              </Text>
            </Button>

            <Button variant="ghost" textVariant="semibold" onPress={onClose}>
              Maybe Later
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
