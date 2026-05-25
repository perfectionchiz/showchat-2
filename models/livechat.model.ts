import { User } from "./auth.model";

interface Reaction {
  emoji: string;
  count: number;
}

export interface LiveStream {
  id: string;
  avatarUrl: string;
  channelName: string;
  channelVerified: boolean;
  title: string;
  viewers: number;
  reactions?: { emoji: string; count: number }[];
  extraReactionsCount: number;
  participantAvatars: { user_id: string; display_name: string }[];
  endsAt: string;
  progress?: number;
  isLive: boolean;
  timeslot?: string;
  showType?: string;
  channelLogo?: string;
  startsAt: string;
  banner?: string;
  description?: string;
  vibe?: string | null;
  messageCount: number;
  roomStatus?: "live" | "ended" | "scheduled";
  watchedBefore: boolean;
}
export interface LiveShow {
  id: string;
  avatarUrl: string;
  showType: string;
  year: string;
  title: string;
  genres?: string[];
  createdAt?: string;
  description?: string;
  profile_url?: string;
}
export interface Message {
  id: string;
  display_name: string;
  message: string;
  created_at: string;
  profile_url?: string;
}

export interface SilentModeViewProps {
  roomVibe: string | null;
  programTitle: string;
  programImage?: string | null;
  channelName: string;
  channelLogo?: string | null;
  isLive: boolean;
  messageCount: number;
  recentCounts: { emoji: string; count: number }[];
  canReact: boolean;
  onReaction: (emoji: string) => void;
  onExpandChat: () => void;
  messages: Message[];
  isLoading: boolean;
  roomStatus?: "live" | "ended" | "scheduled";
}
export interface ShowMessage {
  id: string;
  display_name: string;
  message: string;
  created_at: string;
  user_id?: string | null;
  isGhost?: boolean;
  profile_url?: string;
  avatar_url?: string;
}

export interface ShowRoomData {
  id: string;
  title: string;
  poster_url?: string;
  overview?: string;
  first_air_date?: string;
  genres?: { id: number; name: string }[];
  created_at: string;
}
export interface ShowRoom {
  openChat?: boolean;
  setOpenChat: (openChat: boolean) => void;
  goBack: () => void;
  myRoom: LiveStream | null;
  user: User | null;
  roomType: "show" | "live" | "private";
}
export interface LiveRoomApi {
  id: string;
  program_id: string;
  channel_id: string;
  message_count_10min: number;
  starts_at: string;
  ends_at: string;
  is_trending: boolean;

  program: {
    title: string;
    subtitle: string;
    category: string;
    description: string;
    image_url: string;
  };

  channel: {
    name: string;
    logo_url: string;
  };
}

export interface GetLiveRoomsResponse {
  message: string;
  success: boolean;
  status: number;
  data: {
    hero: LiveRoomApi[];
    also_live: LiveRoomApi[];
    categories: string[];
  };
}
