import { ChatRoom } from "@/models/tmdb.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type RoomState = "LIVE" | "GRACE" | "CLOSED";

interface PresenceUser {
  user_id: string;
  display_name?: string;
  avatar_url?: string;
}

interface ShowState {
  currentShow: ChatRoom | null;

  sub_room_id: string | null;
  root_room_id: string | null;
  presenceUsers: PresenceUser[];

  roomState: RoomState;

  setShow: (show: ChatRoom) => void;

  setRoomIds: (data: { sub_room_id: string; root_room_id: string }) => void;

  setPresenceUsers: (users: PresenceUser[]) => void;

  setRoomState: (state: RoomState) => void;

  clearShow: () => void;
}

export const useShowStore = create<ShowState>()(
  persist(
    (set) => ({
      currentShow: null,
      sub_room_id: null,
      root_room_id: null,

      presenceUsers: [],

      roomState: "LIVE",

      setShow: (show) => set({ currentShow: show }),

      setRoomIds: ({ sub_room_id, root_room_id }) =>
        set({ sub_room_id, root_room_id }),

      setPresenceUsers: (users) => set({ presenceUsers: users }),

      setRoomState: (state) => set({ roomState: state }),

      clearShow: () =>
        set({
          currentShow: null,
          sub_room_id: null,
          root_room_id: null,
          presenceUsers: [],
          roomState: "LIVE",
        }),
    }),
    {
      name: "show-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentShow: state.currentShow,
        sub_room_id: state.sub_room_id,
        root_room_id: state.root_room_id,
      }),
    },
  ),
);
