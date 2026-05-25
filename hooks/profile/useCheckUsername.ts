import { UsernameAvailabilityResponse } from "@/models/profile.model";
import { userService } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";

export const useCheckUsername = (username: string) => {
  return useQuery<UsernameAvailabilityResponse>({
    queryKey: ["username", username],
    queryFn: () => userService.checkUsername(username),
    enabled: !!username,
  });
};
