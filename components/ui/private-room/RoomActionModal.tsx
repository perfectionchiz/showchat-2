import { Text } from "@/components/ui/Text";
import { LogOut, Trash2, User, UserPlus2 } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: "invite" | "members" | "leave" | "delete") => void;
  isOwner: boolean;
};

export default function RoomActionsMenu({
  visible,
  onClose,
  onSelect,
  isOwner,
}: Props) {
  if (!visible) return null;

  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="absolute inset-0 z-40"
      />

      <View
        style={{ top: 85, right: 16 }}
        className="absolute z-50 w-56 rounded-2xl bg-[#0f172a] border border-gray-800 shadow-lg overflow-hidden"
      >
        {isOwner && (
          <TouchableOpacity
            className="px-4 py-4 flex-row justify-between border-b border-gray-800"
            onPress={() => {
              onSelect("invite");
              onClose();
            }}
          >
            <Text className="text-white text-sm">Invite Member</Text>
            <User size={18} color={"#d4d4d8"} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className="px-4 py-4 flex-row justify-between border-b border-gray-800"
          onPress={() => {
            onSelect("members");
            onClose();
          }}
        >
          <Text className="text-white text-sm">View Members</Text>
          <UserPlus2 size={18} color={"#d4d4d8"} />
        </TouchableOpacity>

        {isOwner ? (
          <TouchableOpacity
            className="px-4 py-4 flex-row justify-between"
            onPress={() => {
              onSelect("delete");
              onClose();
            }}
          >
            <Text className="text-red-500 text-sm">Delete Room</Text>
            <Trash2 size={18} color={"#f44034"} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="px-4 py-4 flex-row justify-between"
            onPress={() => {
              onSelect("leave");
              onClose();
            }}
          >
            <Text className="text-red-500 text-sm">Leave Room</Text>
            <LogOut size={18} color={"#f44034"} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}
