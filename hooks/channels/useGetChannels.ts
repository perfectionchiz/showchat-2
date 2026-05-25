import { channelsService } from "@/services/channels.service";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useGetChannels = (search?: string) => {
  const PAGE_SIZE = 20;

  return useInfiniteQuery({
    queryKey: ["channel-browser", search],

    initialPageParam: 1,

    queryFn: ({ pageParam = 1 }) =>
      channelsService.getChannelBrowsers({
        search,
        page: pageParam,
      }),

    getNextPageParam: (lastPage, allPages) => {
      const currentItems = lastPage?.channels?.length ?? 0;
      if (currentItems === 0) return undefined;

      if (currentItems < PAGE_SIZE) return undefined;
      return allPages.length + 1;
    },
  });
};
