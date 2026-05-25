import { tmdbService } from "@/services/tmdb.service";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 20;

export function useGetTmdbShows(genres: string[]) {
  return useInfiniteQuery({
    queryKey: ["tmdb-shows", genres],

    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      tmdbService.getTmbdShows({
        genres,
        page: pageParam,
      }),

    getNextPageParam: (lastPage, allPages) => {
      const items = lastPage?.data ?? [];

      const hasMore = items.length === PAGE_SIZE;

      return hasMore ? allPages.length + 1 : undefined;
    },

    enabled: Array.isArray(genres) && genres.length > 0,
  });
}
