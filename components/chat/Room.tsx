import { SilentModeView } from "@/components/chat/SilentModeView";
import { useRoomLifecycle } from "@/hooks/messages/useRoomLifeCycle";
import { useRoomPresence } from "@/hooks/messages/useRoomPresence";
import { useSendMessage } from "@/hooks/messages/useSendMessage";
import { useTyping } from "@/hooks/messages/useTyping";
import { useRoomActions } from "@/hooks/room/useRoomActions";
import { useRoomRealtime } from "@/hooks/room/useRoomRealTime";
import { useConfirm } from "@/hooks/useAlert";
import { useCountdown } from "@/hooks/useCountDown";
import { ShowMessage, ShowRoom } from "@/models/livechat.model";
import { useShowStore } from "@/store/chatStore";
import { dummyMessages } from "@/utils/ambientActivity";
import { truncate } from "@/utils/truncate";
import { router } from "expo-router";
import { ArrowLeft, Users, VolumeX } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConfirmModal } from "../common/ConfirmAlertModal";
import { IconButton } from "../common/IconButton";
import { LiveBadge } from "../live/LiveBadge";
import FallbackImage from "../ui/FallbackImage";
import { ShowProgressBar } from "../ui/ShowProgressBar";
import { Text } from "../ui/Text";
import { ChatFooter } from "./ChatFooter";
import { ChatMessages } from "./ChatMessages";
import { NoRoom } from "./NoRoom";
import { RoomVibeHeader } from "./RoomVibeHeader";
import { WatchOnlyBanner } from "./WatchOnlyBanner";

const Room = ({
  openChat = false,
  setOpenChat,
  myRoom,
  user,
  roomType,
}: ShowRoom) => {
  const [messages, setMessages] = useState<ShowMessage[]>([]);
  const { sub_room_id, root_room_id, setRoomIds, clearShow } = useShowStore();
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const { confirm, ConfirmModalProps } = useConfirm();
  const [showCelebration, setShowCelebration] = useState(false);
  const { mutate } = useSendMessage(setMessageInput, user, () =>
    setShowCelebration(true),
  );

  const { presenceUsers } = useShowStore();
  useRoomPresence(myRoom?.id || "", user, true);
  const isLive =
    myRoom?.roomStatus !== undefined && myRoom?.roomStatus !== null
      ? myRoom.roomStatus === "live"
      : !!myRoom?.isLive;
  const { isTyping, typingUsers, sendTypingEvent } = useTyping({
    roomId: myRoom?.id || "",
    user: user,
  });
  const countdown = useCountdown(myRoom?.endsAt as any);
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

  useRoomRealtime(myRoom?.id || "", openChat, () => {
    handleLeaveRoom(
      "Live chat ended",
      "This live chat has ended. It will remain open for 30 minutes.\n\nYou can choose to stay or leave.",
    );
  });

  const handleLeaveRoom = (title: string, subtitle: string) => {
    if (!myRoom?.id) return;
    confirm(title, subtitle, async () => {
      await leaveRoom.mutateAsync({
        root_room_id: root_room_id ?? myRoom.id,
        sub_room_id: sub_room_id!,
        room_type: "show",
      });
    });
  };

  const handleReaction = (emoji: string) => {
    reactToRoom.mutate({ emoji, room_id: myRoom?.id || "", room_type: "live" });
  };

  useEffect(() => {
    setMessages(dummyMessages);

    setLoading(false);
  }, []);

  const handleSendMessage = (url?: string) => {
    const contentToSend = url || messageInput?.trim();
    if (!contentToSend) return;

    mutate({
      root_room_id: myRoom?.id ?? "",
      room_type: "live",
      message: contentToSend,
      display_name: user?.display_name ?? "",
    });
    if (!url) {
      setMessageInput("");
    }
  };

  useRoomLifecycle(myRoom?.id || "", openChat);
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#0b1220]">
        <ActivityIndicator size="large" color="#f87171" />
      </View>
    );
  }

  if (!myRoom) {
    return <NoRoom goBack={() => router.back()} />;
  }

  const handleExpandChat = () => {
    joinRoom.mutate(
      {
        room_id: myRoom?.id,
        room_type: "live",
      },
      {
        onSuccess: (res: any) => {
          setOpenChat(true);
          useShowStore.getState().setRoomIds({
            sub_room_id: res.sub_room_id,
            root_room_id: res.root_room_id || "",
          });
        },
      },
    );
  };

  return (
    <SafeAreaView edges={[]} className="flex-1">
      {!openChat ? (
        <SilentModeView
          roomVibe={myRoom.vibe || "Quiet"}
          programTitle={myRoom?.title || ""}
          channelName={myRoom?.channelName || ""}
          channelLogo={myRoom?.avatarUrl}
          isLive={myRoom?.isLive || false}
          messageCount={messages.length}
          recentCounts={[]}
          roomStatus={myRoom.roomStatus}
          programImage={myRoom.banner}
          canReact={true}
          isLoading={joinRoom.isPending}
          onReaction={handleReaction}
          onExpandChat={handleExpandChat}
          messages={messages}
        />
      ) : (
        <View className="flex-1">
          <View className="border-b pt-2 border-gray-800  bg-primary">
            <View className="px-6">
              <View className="flex-row items-center justify-between  gap-x-2">
                <View className="flex-row items-center gap-x-2">
                  <IconButton
                    className="p-0 bg-background rounded-full "
                    icon={<ArrowLeft color={"#fff"} size={24} />}
                    onPress={() =>
                      handleLeaveRoom(
                        "Leave Chat",
                        "Are you sure you want to leave this room?",
                      )
                    }
                  />
                  {myRoom?.avatarUrl && (
                    <View className="w-10 bg-white rounded-md p-1 h-10 overflow-hidden">
                      <FallbackImage
                        uri={myRoom?.avatarUrl}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </View>
                  )}
                  <View>
                    <View className="flex-row items-center gap-x-2 mt-4">
                      <Text
                        variant="semibold"
                        className="text-muted-foreground"
                      >
                        {truncate(myRoom?.channelName || "", 20)}
                      </Text>
                      {isLive ? (
                        <LiveBadge />
                      ) : (
                        <View className="bg-blue-500 rounded-lg px-2">
                          <Text
                            variant="semibold"
                            className="text-sm uppercase"
                          >
                            Ended
                          </Text>
                        </View>
                      )}

                      <TouchableOpacity onPress={() => setOpenChat(false)}>
                        <VolumeX color={"#fff"} size={20} />
                      </TouchableOpacity>
                    </View>
                    <View className="">
                      <View className="flex-row items-start justify-between gap-2">
                        <Text
                          variant="semibold"
                          numberOfLines={2}
                          className="text-white text-[15px]  leading-5"
                        >
                          {truncate(myRoom?.title, 22)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View>
                  <View className="flex-row items-center gap-x-1">
                    <Users size={17} color={"#95A3B8"} />
                    <Text className="text-sm">
                      {presenceUsers?.length} {""}
                      <Text className="text-green-500">live</Text>
                    </Text>
                  </View>
                  <Text
                    className={`  text-sm ${countdown?.label === "Ended" ? "text-red-600" : "text-muted-foreground"}`}
                  >
                    {countdown?.label}
                  </Text>
                  <View className="pt-0.5">
                    <RoomVibeHeader mode="emoji" vibe={myRoom.vibe || ""} />
                  </View>
                </View>
              </View>
            </View>

            <View className="mt-4">
              <ShowProgressBar
                endsAt={myRoom.endsAt}
                startsAt={myRoom.startsAt}
              />
            </View>
          </View>

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}
          >
            <ChatMessages
              sendMessage={handleSendMessage}
              setMessageCelebration={setShowCelebration}
              showCelebration={showCelebration}
              isTyping={isTyping}
              typingUsers={typingUsers}
              roomType={roomType}
              roomId={myRoom.id}
            />

            {user ? (
              <View>
                <ChatFooter
                  roomId={myRoom.id}
                  onStickerSend={(url) => {
                    handleSendMessage(url);
                  }}
                  isPremium={user?.is_premium}
                  onReaction={handleReaction}
                  handleSendMessage={() => handleSendMessage()}
                  setMessageInput={setMessageInput}
                  messageInput={messageInput}
                  startTyping={sendTypingEvent}
                />
              </View>
            ) : (
              <WatchOnlyBanner
                goToAuth={() => {
                  router.replace("/sign-in");
                }}
              />
            )}
          </KeyboardAvoidingView>
        </View>
      )}
      <ConfirmModal {...ConfirmModalProps} />
    </SafeAreaView>
  );
};

export default Room;
