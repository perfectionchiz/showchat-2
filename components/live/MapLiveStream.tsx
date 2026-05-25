import { LiveStream } from "@/models/livechat.model";
import { formatTimeslot } from "@/utils/getTimeSlot";

export const mapToLiveStream = (item: any): LiveStream => {
  const { timeslot } = formatTimeslot(item.start_time, item.end_time);

  return {
    id: item.id,
    title: item.program?.title ?? "",
    description: item.program?.description ?? "",
    banner: item.program?.image_url ?? item.channel?.logo_url,
    avatarUrl: item.channel?.logo_url ?? "",
    channelName: item.channel?.name ?? "",
    isLive: item?.is_live,
    roomStatus: item?.room_status,
    messageCount: item?.message_count_10min ?? 0,
    vibe: item?.vibe,
    viewers: item?.user_count ?? 0,
    timeslot: timeslot,
    showType: item.program?.category ?? "",
    reactions: item?.top_reactions,
    watchedBefore: item?.watched_before,
    participantAvatars: item?.recent_chatters,
    extraReactionsCount: 0,
    channelVerified: false,
    channelLogo: item?.channel?.logo_url,
    startsAt: item.starts_at,
    endsAt: item.ends_at,
  };
};
