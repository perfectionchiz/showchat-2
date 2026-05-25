import { liveService } from "@/services/live-now.service";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 10;

const normalizeLiveRooms = (
  data: any,
  search?: string,
  isFirstPage: boolean = true,
) => {
  if (search) {
    const list = Array.isArray(data) ? data : [];
    return {
      also_live: list,
      hero: isFirstPage
        ? list.filter((item) => item?.is_trending === true)
        : [],
    };
  }
  return {
    hero: isFirstPage ? (data?.hero ?? []) : [],
    also_live: data?.also_live ?? [],
  };
};

export const useGetLiveRoomsInfinite = (search?: string) => {
  return useInfiniteQuery({
    queryKey: ["live-rooms", search],
    initialPageParam: 1,

    queryFn: async ({ pageParam = 1 }) => {
      const res = await liveService.getLiveRooms({
        search,
        page: pageParam,
      });

      const rawData = Array.isArray(res) ? res[0]?.data : res.data;

      const normalized = normalizeLiveRooms(rawData, search, pageParam === 1);

      return {
        ...res,
        data: normalized,
      };
    },

    getNextPageParam: (lastPage, allPages) => {
      const currentItems = lastPage?.data?.also_live?.length ?? 0;

      if (currentItems === 0) return undefined;

      if (currentItems < PAGE_SIZE) return undefined;

      return allPages.length + 1;
    },
  });
};
