export interface ShowChatItem {
  id: number;
  tmdb_id: number;
  show_type: "movie" | "tv";
  title: string;
  poster_url: string;
  backdrop_url: string | null;
  score: number;
  rank: number;
  metadata: {
    genre_ids: number[];
    popularity: number;
    vote_count: number;
    vote_average: number;
    first_air_date: string;
  };
  created_at: string;
}

export interface TrendingShowChatResponse {
  message: string;
  success: boolean;
  status: number;
  data: ShowChatItem[];
}

export interface SearchShowChatItem {
  tmdb_id: number;
  title: string;
  overview: string;
  poster_url: string | null;
  backdrop_url: string | null;
  first_air_date: string;
  genre_ids: number[];
  vote_average: number;
  media_type: string;
}

export interface SearchShowChatData {
  page: number;
  total_pages: number;
  total_results: number;
  results: SearchShowChatItem[];
}

export interface SearchShowChatResponse {
  message: string;
  success: boolean;
  status: number;
  data: SearchShowChatData;
}
export interface RoomGenre {
  id: string;
  name: string;
}

export interface ChatRoom {
  id: string;
  show_type: "movie" | "tv";
  tmdb_id: number;
  title: string;
  sub_room_id: string;
  poster_url: string;
  backdrop_url: string;
  overview: string;
  first_air_date: string;
  genres: RoomGenre[];
  slug: string;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
}

export interface OpenChatResponse {
  message: string;
  success: boolean;
  status: number;
  room: ChatRoom;
}
export interface TmdbShow {
  tmdb_id: number;
  title: string;
  poster_url: string;
  backdrop_url: string;
  genre_ids: number[];
  overview: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  release_date: string;
  show_type: "movie" | "tv";
}
export interface TmdbShowResponse {
  data: TmdbShow[];
  page?: number;
  total_pages?: number;
}
export type TmdbShowsPage = {
  data: TmdbShow[];
  page: number;
  total_pages?: number;
};
