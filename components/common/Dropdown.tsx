import { FlashList } from "@shopify/flash-list";
import { X } from "lucide-react-native";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
} from "react-native";
import DebouncedSearchInput from "../forms/SearchInput";
import { Text } from "../ui/Text";

const { height } = Dimensions.get("window");
const SHEET_HEIGHT = height * 0.5;

export type DropdownItem = { label: string; value: string };

type Props = {
  data: DropdownItem[];
  value?: string | null;

  loading?: boolean;
  onSearch: (query: string) => void;

  onChange: (value: string) => void;

  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const Dropdown = ({
  data,
  value,
  loading,
  onSearch,
  onChange,
  open,
  onOpenChange,
}: Props) => {
  const setOpen = (v: boolean) => onOpenChange(v);

  const handleSelect = useCallback(
    (itemValue: string) => {
      onChange(itemValue);
      setOpen(false);
    },
    [onChange, onOpenChange],
  );

  return (
    <Modal visible={open} transparent animationType="slide">
      <Pressable
        onPress={() => setOpen(false)}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      />

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: SHEET_HEIGHT,
        }}
        className="bg-primary rounded-3xl"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View className=" flex-1 rounded-t-[28px] border-t border-gray-800 overflow-hidden">
            <View className="items-center pt-3">
              <View className="w-12 h-1.5 bg-gray-700 rounded-full" />
            </View>
            <View className="px-5 py-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-white">
                Filter by channel
              </Text>

              <Pressable
                onPress={() => setOpen(false)}
                className="p-2 rounded-full bg-gray-800"
              >
                <X size={18} color="#fff" />
              </Pressable>
            </View>

            <View className="px-5 pb-3">
              <DebouncedSearchInput
                onSearch={onSearch}
                placeholder="Search..."
                debounceMs={400}
              />
            </View>

            <View className="bg-primary" style={{ flex: 1 }}>
              {loading ? (
                <View className="py-10 items-center">
                  <ActivityIndicator />
                  <Text className="text-gray-500 mt-2">Loading...</Text>
                </View>
              ) : (
                <FlashList
                  data={data}
                  keyExtractor={(item) => item.value}
                  contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingBottom: 30,
                  }}
                  renderItem={({ item }) => {
                    const isSelected = item.value === value;

                    return (
                      <Pressable
                        onPress={() => handleSelect(item.value)}
                        className={`p-4 mb-3 rounded-xl flex-row items-center ${
                          isSelected ? "border border-gray-300" : ""
                        }`}
                      >
                        <Text
                          className={`flex-1 ${
                            isSelected
                              ? "text-white font-semibold"
                              : "text-gray-300"
                          }`}
                        >
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                  }}
                />
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};
