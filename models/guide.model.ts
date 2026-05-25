export interface Program {
  title: string;
  subtitle: string;
  category: string;
  description?: string;
  image_url: string;
}

export interface Channel {
  name: string;
  logo_url: string;
}

export interface GuideItem {
  id: string;
  channel_id: string;
  program_id: string;
  start_time: string;
  end_time: string;
  is_live: boolean;
  is_trending: boolean;
  program: Program;
  channel: Channel;
}

export interface GuideResponse {
  message: string;
  success: boolean;
  status: number;
  data: GuideItem[];
}

export interface TrendingLiveRoomItem {
  id: string;
  program_id: string;
  channel_id: string;
  message_count_10min: number;
  trending_rank: number;
  program: Program;
  channel: Channel;
}

export interface TrendingLiveRoomsResponse {
  message: string;
  success: boolean;
  status: number;
  data: TrendingLiveRoomItem[];
}

export interface AiringItem {
  id: string;
  program_id: string;
  channel_id: string;
  message_count_10min: number;
  starts_at: string;
  ends_at: string;
  is_trending: boolean;
  program: Program;
  channel: Channel;
}

export interface RecommendedAiringsResponse {
  message: string;
  success: boolean;
  status: number;
  data: {
    hero: AiringItem[];
    also_live: AiringItem[];
    categories: string[];
  };
}
