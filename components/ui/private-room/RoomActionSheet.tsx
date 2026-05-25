import { PrivateRoom } from "@/models/private-room.model";
import React from "react";
import { Modal, Pressable, View } from "react-native";
import DeleteRoom from "./actions/DeleteRoom";
import InviteMemebers from "./actions/InviteMemebers";
import LeaveRoom from "./actions/LeaveRoom";
import ViewMemebers from "./actions/ViewMemebers";

type ActionType = "invite" | "members" | "leave" | "delete" | null;

type Props = {
  type: ActionType;
  visible: boolean;
  onClose: () => void;
  onInvite: () => void;
  onLeave: () => void;
  onRemoveMember: () => void;
  onDeleteRoom: () => void;
  isDeletingRoom: boolean;
  isLeavingRoom: boolean;
  isInviting: boolean;
  isRemovingMember: boolean;
  privateRoom: PrivateRoom;
  isOwner: boolean;
};

export default function RoomActionSheet({
  type,
  visible,
  onClose,
  isInviting,
  onInvite,
  privateRoom,
  onLeave,
  isLeavingRoom,
  isOwner,
  isRemovingMember,
  onRemoveMember,
  onDeleteRoom,
  isDeletingRoom,
}: Props) {
  if (!visible || !type) return null;

  const renderContent = () => {
    switch (type) {
      case "invite":
        return (
          <InviteMemebers
            room={privateRoom}
            isInviting={isInviting}
            onInvite={onInvite}
          />
        );

      case "members":
        return (
          <ViewMemebers
            isRemovingMember={isRemovingMember}
            onRemoveMember={onRemoveMember}
            isOwner={isOwner}
            room={privateRoom}
            onClose={onClose}
          />
        );

      case "leave":
        return <LeaveRoom isLeavingRoom={isLeavingRoom} leave={onLeave} />;
      case "delete":
        return (
          <DeleteRoom
            isDeletingRoom={isDeletingRoom}
            deleteRoom={onDeleteRoom}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <View className="bg-[#0f172a] rounded-t-3xl p-5">
          {renderContent()}
        </View>
      </Pressable>
    </Modal>
  );
}
