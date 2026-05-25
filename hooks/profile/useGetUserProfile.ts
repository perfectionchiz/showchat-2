import { User } from "@/models/auth.model";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
export type PartialUser = Partial<
  Pick<
    User,
    | "username"
    | "display_name"
    | "bio"
    | "name"
    | "favourite_genres"
    | "notify"
    | "avatar_url"
    | "role"
  >
>;
export type ProfileForm = {
  username: string;
  display_name: string;
  bio: string;
  name: string;
  favourite_genres: string[];
  notify: boolean;
  avatar_url: string | undefined;
  role: string;
  file?: {
    uri: string;
    name: string;
    type: string;
  };
};
export function useGetProfile() {
  const { setProfile, session } = useAuthStore();
  const accessToken = session?.access_token;

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: () => userService.getUserProfile(),
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (!query.data) return;
    const profile = query?.data.profile;
    setProfile({ ...profile });
  }, [query.data]);

  return {
    ...query,
    isProfileLoading: query.isLoading || query.isFetching,
  };
}
