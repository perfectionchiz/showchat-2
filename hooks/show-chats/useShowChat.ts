import { SearchShowChatItem } from "@/models/tmdb.model";
import { tmdbService } from "@/services/tmdb.service";
import { useInfiniteQuery } from "@tanstack/react-query";

type ActionType = "search" | "trending";

interface UseShowChatParams {
  action: ActionType;
  query?: string;
}

export const useShowChat = ({ action, query }: UseShowChatParams) => {
  const isSearch = action === "search";

  return useInfiniteQuery({
    queryKey: [
      isSearch ? "show-chat-search" : "show-chat-trending",
      action,
      query,
    ],

    initialPageParam: 1,

    queryFn: async ({ pageParam = 1 }) => {
      const res: any = await (isSearch
        ? tmdbService.searchShowChats(query!, pageParam)
        : tmdbService.getShowChats(pageParam));

      const rawItems = isSearch ? res.data.results : res.data;

      const normalizedItems: SearchShowChatItem[] = (rawItems ?? []).map(
        (item: any) => {
          if (isSearch) {
            return {
              tmdb_id: item.tmdb_id,
              title: item.title,
              overview: item.overview ?? "",
              poster_url: item.poster_url,
              backdrop_url: item.backdrop_url,
              first_air_date: item.first_air_date || item?.release_date,
              genre_ids: item.genre_ids,
              vote_average: item.vote_average || item.vote_count,
              media_type: item.media_type || item.show_type,
            };
          } else {
            return {
              tmdb_id: item.tmdb_id,
              title: item.title,
              overview: "",
              poster_url: item.poster_url,
              backdrop_url: item.backdrop_url,
              first_air_date: item.metadata?.first_air_date,
              genre_ids: item.metadata?.genre_ids,
              vote_average: item.metadata?.vote_average,
              media_type: item.show_type,
            };
          }
        },
      );

      return {
        items: normalizedItems,
      };
    },

    getNextPageParam: (lastPage, allPages) => {
      const currentCount = lastPage?.items?.length ?? 0;
      const PAGE_SIZE = 20;

      if (currentCount === 0 || currentCount < PAGE_SIZE) {
        return undefined;
      }

      return allPages.length + 1;
    },

    enabled: isSearch ? !!query && query.trim().length > 0 : true,
  });
};
