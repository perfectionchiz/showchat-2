import { ArrowLeft } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";

import { ChatFooter } from "@/components/chat/ChatFooter";
import { ChatMessages, ChatMessagesRef } from "@/components/chat/ChatMessages";
import { NoRoom } from "@/components/chat/NoRoom";
import { WatchOnlyBanner } from "@/components/chat/WatchOnlyBanner";

import { ConfirmModal } from "@/components/common/ConfirmAlertModal";
import { IconButton } from "@/components/common/IconButton";
import FallbackImage from "@/components/ui/FallbackImage";
import { Text } from "@/components/ui/Text";
import { useSendMessage } from "@/hooks/messages/useSendMessage";
import { useTyping } from "@/hooks/messages/useTyping";
import { useRoomActions } from "@/hooks/room/useRoomActions";
import { useOpenChat } from "@/hooks/show-chats/useOpenChat";
import { useConfirm } from "@/hooks/useAlert";
import { useAuthStore } from "@/store/authStore";
import { useShowStore } from "@/store/chatStore";
import { formatISO } from "@/utils/formatTime";
import { truncate } from "@/utils/truncate";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const ShowRoom: React.FC = () => {
  const { tmdb_id, media_type } = useLocalSearchParams<{
    roomId?: string;
    tmdb_id?: string;
    media_type?: string;
  }>();
  const { confirm, ConfirmModalProps } = useConfirm();
  const room = useShowStore((s) => s.currentShow);
  const user = useAuthStore((s) => s.user);
  const [showCelebration, setShowCelebration] = useState(false);
  const { sub_room_id, root_room_id, setRoomIds, clearShow } = useShowStore();
  const [messageInput, setMessageInput] = useState("");
  const chatRef = useRef<ChatMessagesRef>(null);
  const { mutate } = useSendMessage(setMessageInput, user, () =>
    setShowCelebration(true),
  );
  const displayGenres = (genres: string) => {
    const items = genres.split(", ");
    if (items.length <= 2) return genres;
    return `${items.slice(0, 2).join(", ")}, ...`;
  };
  const { isTyping, typingUsers, sendTypingEvent } = useTyping({
    roomId: room?.id || "",
    user: user,
  });
  const { mutate: openChat, isPending } = useOpenChat();
  const { joinRoom, leaveRoom, reactToRoom } = useRoomActions({
    onJoinSuccess: (res, variables) => {
      setRoomIds({
        sub_room_id: res.sub_room_id,
        root_room_id: variables.room_id,
      });
    },

    onLeaveSuccess: () => {
      clearShow();
      router.back();
    },
  });

  useFocusEffect(
    useCallback(() => {
      if (!room?.id) return;

      joinRoom.mutate(
        {
          room_id: room.id,
          room_type: "show",
        },
        {
          onSuccess: (res: any) => {
            setRoomIds({
              sub_room_id: res.sub_room_id,
              root_room_id: room.id,
            });
          },
        },
      );

      return () => {};
    }, [room?.id]),
  );
  const handleLeaveRoom = () => {
    if (!room?.id) return;

    confirm(
      "Leave Chat",
      "Are you sure you want to leave this room?",
      async () => {
        await leaveRoom.mutateAsync({
          root_room_id: root_room_id ?? room.id,
          sub_room_id: sub_room_id!,
          room_type: "show",
        });
      },
    );
  };
  useEffect(() => {
    if (!room && tmdb_id && media_type) {
      openChat({
        tmdb_id: tmdb_id,
        media_type,
      });
    }
  }, [room, tmdb_id, media_type, openChat]);

  const handleSendMessage = (url?: string) => {
    const contentToSend = url || messageInput?.trim();
    if (!contentToSend) return;

    mutate({
      root_room_id: room?.id ?? "",
      room_type: "show",
      message: contentToSend,
      display_name: user?.display_name ?? "",
    });
    if (!url) {
      setMessageInput("");
    }
  };

  if (!room && isPending) {
    return (
      <View className="flex-1 justify-center items-center bg-[#0b1220]">
        <ActivityIndicator size="large" color="#f87171" />
      </View>
    );
  }

  if (!room) {
    return <NoRoom goBack={() => router.back()} />;
  }

  const genreNames =
    room.genres?.length > 0 ? room.genres.map((g) => g.name).join(", ") : "";

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-primary">
      <View className="flex-row items-start border-b border-gray-800 px-4 pb-3 bg-[#0e162b]">
        <IconButton
          className="mt-6 bg-background rounded-full mr-2"
          icon={<ArrowLeft size={24} color="white" />}
          onPress={handleLeaveRoom}
        />
        <View className="w-12 h-16 mt-7 overflow-hidden rounded-lg ml-2 border border-gray-500">
          <FallbackImage
            style={{ width: "100%", height: "100%" }}
            uri={room.poster_url}
          />
        </View>

        <View className="ml-3 mt-5 flex-1">
          <Text variant="semibold" className="text-white uppercase mt-1">
            {room.title}
          </Text>

          <Text className="text-muted-foreground text-sm">
            {formatISO(room.first_air_date)}
            {genreNames ? ` · ${displayGenres(genreNames)}` : ""}
          </Text>

          <Text className="text-muted-foreground text-sm" numberOfLines={2}>
            {truncate(room.overview || "", 30)}
          </Text>
        </View>
      </View>

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
          roomId={room.id}
          roomType="show"
        />

        {user ? (
          <ChatFooter
            roomId={room.id}
            onStickerSend={(url) => {
              handleSendMessage(url);
            }}
            isPremium={user.is_premium}
            handleSendMessage={() => handleSendMessage()}
            setMessageInput={setMessageInput}
            startTyping={sendTypingEvent}
            messageInput={messageInput}
            onReaction={(emoji: string) => {
              reactToRoom.mutate({
                room_id: room.id,
                room_type: "show",
                emoji,
              });
            }}
          />
        ) : (
          <WatchOnlyBanner goToAuth={() => router.replace("/sign-in")} />
        )}
      </KeyboardAvoidingView>
      <ConfirmModal {...ConfirmModalProps} />
    </SafeAreaView>
  );
};

export default ShowRoom;
