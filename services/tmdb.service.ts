import { http } from "@/lib/httpHelper";
import {
  OpenChatResponse,
  SearchShowChatResponse,
  TmdbShowResponse,
  TrendingShowChatResponse,
} from "@/models/tmdb.model";

export const tmdbService = {
  getShowChats: (page?: number) => {
    const params: Record<string, string | number> = {
      action: "trending",
    };

    if (page) params.page = page;

    return http.get<TrendingShowChatResponse>("/show-chat", params);
  },

  searchShowChats: (query: string, page?: number) => {
    const params: Record<string, string | number> = {
      action: "search",
      query,
    };

    if (page) params.page = page;

    return http.get<SearchShowChatResponse>("/show-chat", params);
  },

  openChat: (payload: { tmdb_id: string; media_type: string }) => {
    return http.post<OpenChatResponse>("/show-chat?action=open-room", {
      action: "open-chat",
      ...payload,
    });
  },
  getTmbdShows: (params: { genres: string[]; page?: number }) => {
    const query: Record<string, string> = {
      genres: params.genres.join(","),
      page: String(params.page ?? 1),
    };

    return http.get<TmdbShowResponse>("/fetch-tmdb-shows", query);
  },
};
