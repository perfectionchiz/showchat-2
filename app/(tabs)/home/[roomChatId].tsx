import Room from "@/components/chat/Room";
import { RoomBackgroundGradient } from "@/components/chat/RoomVibeBackground";
import { useAuthStore } from "@/store/authStore";
import { useRoomStore } from "@/store/roomStore";
import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
export const options = {
  headerShown: false,
};
const LiveRoom: React.FC<{ goBack: () => void }> = () => {
  const [openChat, setOpenChat] = useState<boolean>(false);
  const room = useRoomStore((s) => s.currentRoom);
  const user = useAuthStore((s) => s.user);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-primary">
      {!openChat && <RoomBackgroundGradient vibe={room?.vibe || ""} />}
      <Room
        user={user}
        myRoom={room}
        roomType="live"
        openChat={openChat}
        setOpenChat={setOpenChat}
        goBack={() => router.back()}
      />
    </SafeAreaView>
  );
};

export default LiveRoom;
