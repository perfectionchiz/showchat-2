import { http } from "@/lib/httpHelper";
import { RoomType } from "@/models/message.model";

export const roomService = {
  reactToRoom: (payload: {
    room_id: string;
    room_type: RoomType;
    emoji: string;
  }) => {
    return http.post("/room-react", payload);
  },

  joinRoom: (payload: { room_id: string; room_type: RoomType }) => {
    return http.post("/room-join", payload);
  },

  leaveRoom: (payload: {
    root_room_id: string;
    sub_room_id: string;
    room_type: RoomType;
  }) => {
    return http.post("/room-leave", payload);
  },
};
