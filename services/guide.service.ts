import { http } from "@/lib/httpHelper";
import {
  GuideResponse,
  RecommendedAiringsResponse,
  TrendingLiveRoomsResponse,
} from "@/models/guide.model";

export const guideService = {
  getGuide: (params?: {
    search?: string;
    range?: "now" | "upnext" | "later";
    channel?: string;
  }) => {
    return http.get<GuideResponse>("/guide", params);
  },

  getTrendingLiveRooms: () => {
    return http.get<TrendingLiveRoomsResponse>("/trending-live-rooms");
  },

  getRecommendedAirings: () => {
    return http.get<RecommendedAiringsResponse>("/fetch-recomended-airings");
  },
};
