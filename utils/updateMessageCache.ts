import { queryClient } from "@/lib/queryClient";

type UpdateFn = (msg: any) => any;

export const updateMessagesCache = (
  room_id: string,
  room_type: string,
  updater: UpdateFn,
) => {
  const queryKey = ["messages", room_id, room_type];

  queryClient.setQueryData(queryKey, (old: any) => {
    if (!old?.pages) return old;

    return {
      ...old,
      pages: old.pages.map((page: any) => ({
        ...page,
        messages: page.messages.map((msg: any) => updater(msg)),
      })),
    };
  });
};
