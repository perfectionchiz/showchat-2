import { http } from "@/lib/httpHelper";
import {
  ApiResponse,
  CreatePrivateRoomPayload,
  CreateRoomResponse,
  GetRoomResponse,
  JoinPrivateRoomPayload,
  LeavePrivateRoomPayload,
  PrivateRoom,
  RegenerateInviteResponse,
  RemoveMemberPayload,
} from "@/models/private-room.model";

export const privateRoomService = {
  getInviteInfo: (token: string) => {
    return http.get<{
      room: {
        id: string;
        name: string;
        description: string;
        image_url?: string;
        members_count: number;
        expires_at?: string;
      };
    }>(`/rooms/invite-info?token=${token}`);
  },

  createRoom: (payload: CreatePrivateRoomPayload) =>
    http.post<CreateRoomResponse>("/private-room-create", payload),
  getRoom: () => http.get<GetRoomResponse>("/private-room-list"),

  deleteRoom: () => http.delete("/private-room-delete"),

  joinRoom: (payload: JoinPrivateRoomPayload) =>
    http.post<ApiResponse<{ room: PrivateRoom }>>(
      "/private-room-join",
      payload,
    ),

  leaveRoom: (payload: LeavePrivateRoomPayload) =>
    http.post("/private-room-leave", payload),

  removeMember: (payload: RemoveMemberPayload) =>
    http.post("/private-room-remove-member", payload),
  regenerateLink: () =>
    http.post<RegenerateInviteResponse>("/private-room-regenerate-invite"),
};
