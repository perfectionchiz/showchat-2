import { Button } from "@/components/common/Button";
import { Text } from "@/components/ui/Text";
import React from "react";
import { Modal, Pressable, View } from "react-native";

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

export const ConfirmModal = ({
  visible,
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  loading,
  destructive = true,
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1">
        {/* Overlay */}
        <Pressable
          onPress={!loading ? onCancel : undefined}
          className="absolute inset-0 bg-black/70"
        />

        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-primary w-full rounded-2xl p-5">
            <Text variant="semibold" className="text-white text-lg  mb-2">
              {title}
            </Text>

            <Text className="text-gray-300 mb-5">{message}</Text>

            <View className="flex-row gap-3 justify-end">
              <Button
                textStyles={{
                  color: "#95A3B8",
                }}
                style={{ borderColor: "#95A3B8" }}
                variant="outline"
                onPress={onCancel}
                disabled={loading}
              >
                {cancelText}
              </Button>

              <Button
                onPress={onConfirm}
                isLoading={loading}
                disabled={loading}
                variant={destructive ? "secondary" : "primary"}
              >
                {confirmText}
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
