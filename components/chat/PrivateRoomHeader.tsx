import { PrivateRoom, PrivateRoomMember } from "@/models/private-room.model";
import { getInitials } from "@/utils/getInitials";
import { router } from "expo-router";
import { ChevronLeft, Info, Users } from "lucide-react-native";
import React from "react";
import { Platform, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton } from "../common/IconButton";
import FallbackImage from "../ui/FallbackImage";
import { Text } from "../ui/Text";

type RoomHeaderProps = {
  room: PrivateRoom | undefined;
  presenceUsers: any[];
  currentVibe: any;
  setMenuOpen: (val: boolean) => void;
};

const PrivateRoomHeader: React.FC<RoomHeaderProps> = ({
  room,
  setMenuOpen,
}) => {
  const formatMemberNames = (members: PrivateRoomMember[] = []) => {
    if (!members.length) return "";

    const names = members.map((m) => m.profiles.display_name);

    if (names.length <= 2) return names.join(", ");

    return `${names.slice(0, 2).join(", ")} ...`;
  };

  return (
    <SafeAreaView
      edges={["top"]}
      className={`border-b px-4 pb-3 border-gray-800`}
    >
      <View
        className={`flex-row justify-between ${Platform.OS !== "web" ? "pt-0 " : "pt-6 px-4"}`}
      >
        <View className="flex-row mt-2">
          <IconButton
            className="rounded-full"
            onPress={() => router.replace("/chats")}
            icon={<ChevronLeft size={24} color="#fff" />}
          />
          <View
            className={`w-12 h-12 rounded-xl  bg-indigo-600 items-center justify-center mr-3 overflow-hidden`}
          >
            {room?.image_url ? (
              <FallbackImage
                uri={room.image_url}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Text variant="bold" className="text-white text-2xl">
                {getInitials(room?.name)}
              </Text>
            )}
          </View>

          <View>
            <Text variant="bold" className={`text-white text-xl`}>
              {room?.name}
            </Text>

            <View className="flex-row items-center">
              {room?.description && (
                <Text className={` text-sm text-white`}>
                  {room?.description} -
                </Text>
              )}
              <View className="flex-row gap-2 items-center mt-2">
                <View className="flex-row items-center gap-x-1">
                  <Users size={18} color="#6366f1" />

                  <Text className="text-muted-foreground text-sm">
                    {formatMemberNames(room?.private_room_members)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <IconButton
          className="rounded-full"
          onPress={() => setMenuOpen(true)}
          icon={<Info size={20} color="#a1a1aa" />}
        />
      </View>
    </SafeAreaView>
  );
};

export default PrivateRoomHeader;
