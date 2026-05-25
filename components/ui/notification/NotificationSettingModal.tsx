import { Button } from "@/components/common/Button";
import { Text } from "@/components/ui/Text";
import { Eye, Trash2Icon } from "lucide-react-native";
import React from "react";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onClearAll: () => void;
  onMarkAllRead: () => void;
};

export default function NotificationSettingsModal({
  visible,
  onClose,
  onClearAll,
  onMarkAllRead,
}: Props) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/70 justify-end" onPress={onClose}>
        <View className="bg-background px-4 py-2 rounded-t-3xl">
          <Text
            variant="semibold"
            className="text-white text-xl text-center mt-3 mb-6"
          >
            Notification Settings
          </Text>

          <View className="bg-primary p-6 rounded-2xl">
            <TouchableOpacity
              className="pb-4 flex-row justify-between border-b border-gray-800"
              onPress={() => {
                onMarkAllRead();
                onClose();
              }}
            >
              <Text className="text-white text-base">Mark all as read</Text>
              <Eye size={20} color={"#d4d4d8"} />
            </TouchableOpacity>

            <TouchableOpacity
              className="py-4 flex-row justify-between"
              onPress={() => {
                onClearAll();
                onClose();
              }}
            >
              <Text className="text-white text-base">
                Clear all notifications
              </Text>
              <Trash2Icon size={20} color={"#d4d4d8"} />
            </TouchableOpacity>

            {/* <TouchableOpacity className="py-4 flex-row justify-between">
              <Text className="text-white text-base">
                Notification preferences
              </Text>
              <CogIcon size={20} color={"#d4d4d8"} />
            </TouchableOpacity> */}
          </View>

          <Button
            className="my-2"
            variant="ghost"
            isLoading={false}
            textClassName="text-secondary"
            onPress={onClose}
          >
            Close
          </Button>
        </View>
      </Pressable>
    </Modal>
  );
}
