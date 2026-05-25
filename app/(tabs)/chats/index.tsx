import { CreateRoomModal } from "@/components/chat/CreateRoom";
import { Button } from "@/components/common/Button";
import { IconButton } from "@/components/common/IconButton";
import DebouncedSearchInput from "@/components/forms/SearchInput";
import ShowChatList from "@/components/live/ShowChatList";
import { JoinRoom } from "@/components/ui/private-room/actions/JoinRoom";
import SafeAreaWrapper from "@/components/ui/SafeAreaWrapper";
import SkeletonCircle from "@/components/ui/skeleton/SkeletonCircle";
import { Text } from "@/components/ui/Text";
import { PRIMARY_COLOR } from "@/constants/constants";
import { useInviteRoom } from "@/hooks/room/useInvitePrivateRoom";
import { usePrivateRoom } from "@/hooks/room/usePrivateRoom";
import { useRoomInviteLink } from "@/hooks/room/useRoomInvite";
import { useShowChat } from "@/hooks/show-chats/useShowChat";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Lock, PlusIcon, TrendingUp } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { View } from "react-native";

const ShowChats = () => {
  const [search, setSearch] = useState("");
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const { data: roomPreview } = useInviteRoom(inviteToken);
  const { room, isLoadingRoom, joinRoom, handleCreateRoom, isCreating } =
    usePrivateRoom(() => {
      setShowModal(false);
    });

  const { session, user } = useAuthStore();
  const isLoggedIn = !!session?.access_token;
  useRoomInviteLink(setInviteToken, setShowJoinModal);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useShowChat({
    action: search ? "search" : "trending",
    query: search || undefined,
  });

  const shows = useMemo(
    () => data?.pages?.flatMap((p) => p.items ?? []) ?? [],
    [data],
  );

  return (
    <SafeAreaWrapper>
      {room && (
        <View className="flex-row items-center justify-between  p-4">
          <View className="flex-row items-center gap-3 flex-1">
            <View className="w-9 h-9 bg-violet-500/20 rounded-xl items-center justify-center">
              <Lock size={20} color="#c4d0ff" />
            </View>
            <View>
              <Text variant="semibold" className="text-white text-base">
                {room?.name || "My Private Room"}
              </Text>
              <Text className="text-emerald-400 text-xs">
                Your room • Tap to open
              </Text>
            </View>
          </View>
          <Button
            onPress={() => router.push("/chats/room")}
            size="sm"
            className="rounded-3xl"
            style={{ backgroundColor: "#6366F1" }}
          >
            Access Room
          </Button>
        </View>
      )}
      <View className="px-4 pt-4 pb-4">
        <View className="flex-row items-center justify-between">
          <Text style={{ fontSize: 25 }} variant="bold" className=" text-white">
            Show Chats
          </Text>
          {isLoggedIn && user?.is_premium && (
            <View>
              {isLoadingRoom ? (
                <SkeletonCircle size={40} />
              ) : (
                !room && (
                  <IconButton
                    onPress={() => setShowModal(true)}
                    style={{ backgroundColor: PRIMARY_COLOR }}
                    className="rounded-full w-10 h-10"
                    icon={<PlusIcon size={24} color="#fff" />}
                  />
                )
              )}
            </View>
          )}
        </View>
        <Text className="text-sm text-muted-foreground">
          Chat about any show — live or anytime.
        </Text>
        <View className="mt-3">
          <DebouncedSearchInput onSearch={setSearch} placeholder="Search... " />
        </View>
      </View>
      <ShowChatList
        action={search ? "search" : "trending"}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        data={shows}
        query={search}
        isLoading={isLoading}
        isError={isError}
        hasNextPage={hasNextPage}
        refetch={refetch}
        listHeaderComponent={
          <View className=" p-4  ">
            <View className=" flex-row items-center gap-3">
              {search ? (
                <Ionicons name="search" size={20} color={"#95A3B8"} />
              ) : (
                <TrendingUp size={14} color={"#95A3B8"} />
              )}
              <Text
                variant="medium"
                className="text-muted-foreground text-lg uppercase"
              >
                {search ? "Searched result..." : "Trending this week"}
              </Text>
            </View>
          </View>
        }
      />
      <JoinRoom
        visible={showJoinModal}
        room={roomPreview?.room}
        isLoading={joinRoom.isPending}
        onClose={() => {
          joinRoom.mutate({
            invite_token: inviteToken || "",
          });
        }}
      />
      <CreateRoomModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        mutate={handleCreateRoom}
        isLoading={isCreating}
        initialValues={{
          name: room?.name || "",
          description: room?.description || "",
          image_url: room?.image_url || undefined,
        }}
      />
    </SafeAreaWrapper>
  );
};

export default ShowChats;
