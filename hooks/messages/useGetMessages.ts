import { messageService } from "@/services/message.service";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useGetMessages = (
  room_id: string,
  room_type: "live" | "show" | "private",
  limit = 20,
) => {
  return useInfiniteQuery({
    queryKey: ["messages", room_id, room_type],

    initialPageParam: null as null | {
      before_id: string;
      before_at: string;
    },

    queryFn: ({ pageParam }) =>
      messageService.getMessages({
        room_id,
        room_type,
        limit,
        ...(pageParam ? pageParam : {}),
      }),

    enabled: !!room_id && !!room_type,

    getNextPageParam: (lastPage) => {
      const messages = lastPage?.messages ?? [];

      if (!messages.length || messages.length < limit) return undefined;

      const oldestMessage = messages[messages.length - 1];

      const formattedDate = new Date(oldestMessage.created_at).toISOString();

      return {
        before_id: oldestMessage.id,
        before_at: formattedDate,
      };
    },
  });
};
