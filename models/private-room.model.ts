export interface PrivateRoomMember {
  profiles: { display_name: string };
  user_id: string;
  joined_at: string;
}

export interface PrivateRoom {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  private_room_members: PrivateRoomMember[];
}

export interface CreatePrivateRoomPayload {
  name: string;
  description: string;
  image_url: string;
}

export interface JoinPrivateRoomPayload {
  invite_token: string;
}

export interface LeavePrivateRoomPayload {
  room_id: string;
}

export interface RemoveMemberPayload {
  room_id: string;
  user_id: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface CreateRoomResponse {
  room: PrivateRoom;
  invite_link: string;
  invite_expires_at: string;
  message: string;
}

export interface GetRoomResponse {
  room: PrivateRoom;
}
export interface RegenerateInviteResponse {
  message: string;

  invite_link: string;
  invite_expires_at: string;
}
export interface CreatedRoom {
  id: string;
  name?: string;
  inviteLink?: string;
  inviteToken: string | null;
  inviteExpiresAt?: string;
}
