import { ChatFooter } from "@/components/chat/ChatFooter";
import { ChatMessages, ChatMessagesRef } from "@/components/chat/ChatMessages";
import PrivateRoomHeader from "@/components/chat/PrivateRoomHeader";
import RoomActionsModal from "@/components/ui/private-room/RoomActionModal";
import RoomActionSheet from "@/components/ui/private-room/RoomActionSheet";
import { useChatMessagesState } from "@/hooks/messages/useChatMessagesState";
import { useRoomPresence } from "@/hooks/messages/useRoomPresence";
import { useSendMessage } from "@/hooks/messages/useSendMessage";
import { useTyping } from "@/hooks/messages/useTyping";
import { usePrivateRoom } from "@/hooks/room/usePrivateRoom";
import { useAuthStore } from "@/store/authStore";
import { useShowStore } from "@/store/chatStore";
import React, { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";

export default function RoomScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const user = useAuthStore((s) => s.user);
  const handleClose = () => {
    setMenuOpen(false);
    setActionType(null);
  };

  const { room, regenerateLink, deleteRoom, removeMember, leaveRoom } =
    usePrivateRoom(handleClose);
  const { isTyping, typingUsers, sendTypingEvent } = useTyping({
    roomId: room?.id || "",
    user: user,
  });
  const { currentVibe } = useChatMessagesState(room?.id || "", "private");
  const presenceUsers = useShowStore((s) => s.presenceUsers);
  useRoomPresence(room?.id || "", user, true);

  const [messageInput, setMessageInput] = useState("");
  const chatRef = useRef<ChatMessagesRef>(null);
  const { mutate } = useSendMessage(setMessageInput, user, () =>
    setShowCelebration(true),
  );

  const [actionType, setActionType] = useState<
    "invite" | "members" | "leave" | "delete" | null
  >(null);

  const handleSendMessage = (url?: string) => {
    const contentToSend = url || messageInput?.trim();
    if (!contentToSend) return;

    mutate({
      root_room_id: room?.id ?? "",
      room_type: "private",
      message: contentToSend,
      display_name: user?.display_name ?? "",
    });
    if (!url) {
      setMessageInput("");
    }
  };

  const isOwner = room?.owner_id === user?.id;
  return (
    <View className="flex-1 bg-primary">
      <PrivateRoomHeader
        currentVibe={currentVibe}
        presenceUsers={presenceUsers}
        setMenuOpen={setMenuOpen}
        room={room}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={-16}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ChatMessages
          sendMessage={handleSendMessage}
          showCelebration={showCelebration}
          setMessageCelebration={setShowCelebration}
          isTyping={isTyping}
          typingUsers={typingUsers}
          ref={chatRef}
          roomId={room?.id || ""}
          roomType="private"
        />
        <ChatFooter
          roomId={room?.id || ""}
          onStickerSend={(url) => {
            handleSendMessage(url);
          }}
          isPremium={user?.is_premium}
          handleSendMessage={() => handleSendMessage()}
          setMessageInput={setMessageInput}
          messageInput={messageInput}
          startTyping={sendTypingEvent}
        />
      </KeyboardAvoidingView>

      <RoomActionsModal
        isOwner={isOwner}
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelect={(type) => {
          setActionType(type);
          setSheetOpen(true);
        }}
      />
      {room && (
        <RoomActionSheet
          onDeleteRoom={() => {
            if (actionType === "delete") {
              deleteRoom.mutate();
            }
          }}
          onLeave={() => {
            if (actionType === "leave") {
              leaveRoom.mutate({
                room_id: room.id,
              });
            }
          }}
          onRemoveMember={() => {
            removeMember.mutate({
              room_id: room.id,
              user_id: user?.id || "",
            });
          }}
          isDeletingRoom={deleteRoom.isPending}
          isLeavingRoom={leaveRoom.isPending}
          isRemovingMember={leaveRoom.isPending}
          isInviting={regenerateLink.isPending}
          visible={sheetOpen}
          type={actionType}
          isOwner={isOwner}
          privateRoom={room}
          onClose={handleClose}
          onInvite={() => {
            if (actionType === "invite") {
              regenerateLink.mutate();
            }
          }}
        />
      )}
    </View>
  );
}
