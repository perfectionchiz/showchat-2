import { LiveStream } from "@/models/livechat.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface RoomState {
  currentRoom: LiveStream | null;
  setRoom: (room: LiveStream) => void;
  updateRoom: (data: Partial<LiveStream>) => void;

  clearRoom: () => void;
}

export const useRoomStore = create<RoomState>()(
  persist(
    (set) => ({
      currentRoom: null,

      setRoom: (room) =>
        set({
          currentRoom: room,
        }),
      updateRoom: (data) =>
        set((state) => {
          if (!state.currentRoom) return state;

          return {
            currentRoom: {
              ...state.currentRoom,
              ...data,
            },
          };
        }),

      clearRoom: () =>
        set({
          currentRoom: null,
        }),
    }),
    {
      name: "room-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
