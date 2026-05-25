import { Button } from "@/components/common/Button";
import { Text } from "@/components/ui/Text";
import React from "react";
import { Modal, View } from "react-native";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export const Alert = ({
  visible,
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  loading,
  destructive,
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/60 justify-center items-center px-6">
        <View className="bg-primary w-full rounded-2xl p-5">
          <Text className="text-white text-lg font-semibold mb-2">{title}</Text>

          <Text className="text-gray-300 mb-5">{message}</Text>

          <View className="flex-row gap-3 justify-end">
            <Button variant="secondary" onPress={onCancel} disabled={loading}>
              {cancelText}
            </Button>

            <Button
              onPress={onConfirm}
              isLoading={loading}
              variant={destructive ? "destructive" : "primary"}
            >
              {confirmText}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
