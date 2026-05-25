import { userService } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";

export function useGetFriends() {
  const query = useQuery({
    queryKey: ["user-friends"],
    queryFn: () => userService.getUserFriends(),
  });

  return {
    ...query,
    isFriendsLoading: query.isLoading || query.isFetching,
  };
}
