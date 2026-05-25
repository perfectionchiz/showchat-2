import { Check, FilterX } from "lucide-react-native";
import React from "react";
import { Modal, Pressable, View } from "react-native";
import { Text } from "../ui/Text";

interface SortDropdownProps {
  visible: boolean;
  onClose: () => void;
  sortOption: "Trending" | "Popular" | null;
  onSelect: (option: "Trending" | "Popular" | null) => void;
}

export default function SortDropdown({
  visible,
  onClose,
  sortOption,
  onSelect,
}: SortDropdownProps) {
  const options: ("Trending" | "Popular")[] = ["Trending", "Popular"];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.2)" }}
        onPress={onClose}
      />

      {/* Dropdown */}
      <View
        style={{ marginTop: 140, position: "absolute", right: 16, width: 150 }}
        className="bg-gray-800 rounded-xl shadow-lg"
      >
        <Pressable
          className="px-4 py-2 flex-row justify-between items-center"
          onPress={() => {
            onSelect(null);
            onClose();
          }}
        >
          <Text className="text-white font-medium text-sm">Clear Filter</Text>
          <FilterX color="#fff" size={18} />
        </Pressable>

        <View className="border-t border-gray-700 my-1" />

        {options.map((option) => {
          const selected = sortOption === option;
          return (
            <Pressable
              key={option}
              className={`px-4 py-2 flex-row items-center rounded-lg ${
                selected ? "bg-gray-700" : ""
              }`}
              onPress={() => {
                onSelect(option);
                onClose();
              }}
            >
              <Text
                className={`text-white flex-1 ${selected ? "font-bold" : ""}`}
              >
                {option}
              </Text>
              {selected && <Check color="#f44034" />}
            </Pressable>
          );
        })}
      </View>
    </Modal>
  );
}
