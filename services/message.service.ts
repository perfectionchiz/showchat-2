import { http } from "@/lib/httpHelper";
import { MessageListResponse, RoomType } from "@/models/message.model";

export const messageService = {
  getMessages: (params: {
    room_id: string;
    room_type: RoomType;
    limit?: number;
    before_id?: string;
    before_at?: string;
  }) => {
    return http.get<MessageListResponse>("/message-list", params);
  },
  sendMessage: (payload: {
    root_room_id: string;
    room_type: RoomType;
    message: string;
    display_name: string;
  }) => {
    return http.post("/message-send", payload);
  },

  pinMessage: (message_id: string) => {
    return http.post("/message-pin", { message_id });
  },

  reportMessage: (message_id: string) => {
    return http.post("/message-report", { message_id });
  },

  deleteMessage: (message_id: string) => {
    return http.post("/message-delete", { message_id });
  },

  reactToMessage: (payload: {
    message_id: string;
    emoji: string;
    toggled_off?: boolean;
  }) => {
    return http.post("/message-react", payload);
  },
};
