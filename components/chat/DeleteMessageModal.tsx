import React from "react";
import { Modal, Pressable, View } from "react-native";
import { Text } from "../ui/Text";

interface DeleteConfirmationSheetProps {
  visible: boolean;
  onDelete: () => void;
  setShowVisible: (visible: boolean) => void;
}

export const DeleteConfirmationSheet: React.FC<
  DeleteConfirmationSheetProps
> = ({ visible, setShowVisible, onDelete }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => setShowVisible(false)}
    >
      <Pressable
        className="flex-1 justify-end "
        onPress={() => setShowVisible(false)}
      >
        <Pressable
          className="bg-primary rounded-t-[14px] overflow-hidden pb-8"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="items-center py-6 px-10 border-b border-gray-800">
            <Text
              variant="bold"
              className="text-white text-lg text-center mb-2"
            >
              Delete message?
            </Text>
            <Text className="text-muted-foreground text-sm text-center">
              If you delete this message, it will be permanently removed for
              everyone.
            </Text>
          </View>

          <Pressable
            onPress={onDelete}
            className="py-4 border-b border-gray-800"
          >
            <Text
              variant="bold"
              className="text-[#ED4956] text-center text-base"
            >
              Delete
            </Text>
          </Pressable>

          <Pressable onPress={() => setShowVisible(false)} className="py-4 ">
            <Text className="text-white text-center font-normal text-base">
              Cancel
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
