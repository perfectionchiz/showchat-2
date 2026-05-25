export type RoomType = "live" | "show" | "private";

export type MessageReactionMap = Record<string, number>;

export interface Message {
  id: string;
  user_id: string;
  display_name: string;
  message: string;
  status: "published" | string;
  is_pinned: boolean;
  created_at: string;
  reactions: MessageReactionMap;
  gamification_level: number | undefined;
  is_premium: boolean;
  avatar_url: string;
}
export interface MessageListResponse {
  count: number;
  message: string;
  messages: Message[];
}
