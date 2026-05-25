import {
  useGuide,
  useRecommendedAirings,
  useTrendingLiveRooms,
} from "@/hooks/guide/useGuide";
import { LiveStream } from "@/models/livechat.model";
import { formatTimeslot } from "@/utils/getTimeSlot";
import { useMemo } from "react";

const mapToLiveStream = (item: any): LiveStream => {
  const { timeslot } = formatTimeslot(item.start_time, item.end_time);

  return {
    id: item.id,
    title: item.program?.title || "Untitled",
    description: item.program?.subtitle || "No description available",
    banner: item.program?.image_url,
    messageCount: 0,
    watchedBefore: false,
    avatarUrl: item.channel?.logo_url,
    channelName: item.channel?.name || "Unknown Channel",

    timeslot,
    endsAt: item?.end_time,

    viewers: item.user_count,
    isLive: item.is_live,
    vibe: item.vibe,
    participantAvatars: [],
    reactions: [],
    channelVerified: false,
    extraReactionsCount: 0,

    startsAt: item.start_time || "",
  };
};
export const useGuideScreenData = (
  search: string,
  activeTab: string,
  channel: string,
) => {
  const { data: guideData, isLoading: isLoadingGuide } = useGuide({
    search,
    range: activeTab as any,
    channel: channel,
  });

  const { data: trendingData, isLoading: isLoadingTrending } =
    useTrendingLiveRooms();

  const { data: recommendedData, isLoading: isLoadingRecommendation } =
    useRecommendedAirings();

  const trending = useMemo(() => {
    return trendingData?.data?.map(mapToLiveStream) ?? [];
  }, [trendingData]);

  const recommended = useMemo(() => {
    const data = recommendedData?.data;
    if (!data) return [];
    if (Array.isArray(data)) {
      return data.map(mapToLiveStream);
    }
    return Object.values(data)
      .flat()
      .filter((item: any) => item?.id)
      .map(mapToLiveStream);
  }, [recommendedData]);

  const allShows = useMemo(() => {
    return guideData?.data?.map(mapToLiveStream) ?? [];
  }, [guideData]);

  return {
    trending,
    recommended,
    allShows,
    guideData,
    isLoading: isLoadingGuide || isLoadingRecommendation || isLoadingTrending,
  };
};
