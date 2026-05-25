import { http } from "@/lib/httpHelper";
import { UpdateProfilePayload, User } from "@/models/auth.model";
import { FriendList } from "@/models/friends.model";

export const userService = {
  getUserProfile: () => {
    return http.get<{ profile: User }>("/profile");
  },

  checkUsername: (username: string) => {
    return http.post<{
      message: string;
      success: boolean;
      status: number;
      available: boolean;
      recommendations?: string[];
    }>("/username-available", { username });
  },

  updateProfile: (payload: UpdateProfilePayload) => {
    return http.post<{
      message: string;
      success: boolean;
      status: number;
      profile: User;
    }>("/update-profile", payload);
  },

  userInvite: () => {
    return http.post<{
      message: string;
      success: boolean;
      status: number;
      inviteLink: string;
    }>("/invite");
  },
  getUserFriends: () => {
    return http.get<{
      message: string;
      success: boolean;
      status: number;
      friends: FriendList[];
    }>("/get-friends");
  },
  uploadAvatar: async (
    file: { uri: string; name: string; type: string },
    type: "avatars" | "private-rooms",
    accessToken: string,
  ) => {
    const formData = new FormData();

    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);
    formData.append("bucket", type);
    return fetch(
      `${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/upload-avatar`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      },
    ).then((res) => res.json());
  },
};
