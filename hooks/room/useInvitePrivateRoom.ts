import { privateRoomService } from "@/services/private-room.service";
import { useQuery } from "@tanstack/react-query";

export const useInviteRoom = (token?: string | null) => {
  return useQuery({
    queryKey: ["invite-room", token],
    queryFn: () => privateRoomService.getInviteInfo(token!),
    enabled: !!token,
  });
};
