import { Text } from "@/components/ui/Text";
import { Notification } from "@/models/notifications";
import React from "react";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  notification: Notification | null;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAsUnRead: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function NotificationActionsModal({
  visible,
  notification,
  onClose,
  onMarkRead,
  onDelete,
  onMarkAsUnRead,
}: Props) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/70 justify-end" onPress={onClose}>
        <View className="bg-background p-6 rounded-t-3xl">
          <TouchableOpacity
            className="py-4"
            onPress={() => {
              if (notification?.read) {
                onMarkAsUnRead(notification?.id);
              } else {
                onMarkRead(notification?.id || "");
              }
              onClose();
            }}
          >
            <Text className="text-white text-lg">
              {notification?.read ? "Mark as unread" : "Mark as read"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-4"
            onPress={() => {
              if (notification) {
                onDelete(notification.id);
              }
              onClose();
            }}
          >
            <Text className="text-red-500 text-lg">Delete notification</Text>
          </TouchableOpacity>

          <TouchableOpacity className="py-4" onPress={onClose}>
            <Text className="text-zinc-400 text-lg">Cancel</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}
