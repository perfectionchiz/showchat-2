import { guideService } from "@/services/guide.service";
import { useQuery } from "@tanstack/react-query";

export const guideKeys = {
  all: ["guide"] as const,
  trending: () => [...guideKeys.all, "trending"] as const,
  recommended: () => [...guideKeys.all, "recommended"] as const,
};

export const useGuide = (params?: {
  search?: string;
  range?: "now" | "upnext" | "later";
  channel?: string;
}) => {
  return useQuery({
    queryKey: ["guide", params],
    queryFn: () => guideService.getGuide(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTrendingLiveRooms = () => {
  return useQuery({
    queryKey: guideKeys.trending(),
    queryFn: guideService.getTrendingLiveRooms,
    staleTime: 1000 * 60 * 2,
  });
};

export const useRecommendedAirings = () => {
  return useQuery({
    queryKey: guideKeys.recommended(),
    queryFn: guideService.getRecommendedAirings,
    staleTime: 1000 * 60 * 5,
  });
};
