import { http } from "@/lib/httpHelper";

export type Sticker = {
  id: string;
  url: string;
};

type GiphyResponse = {
  data: any[];
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
};

export const stickersService = {
  getTrendingStickers: (limit: number = 20, offset: number = 0) => {
    const API_KEY = process.env.EXPO_PUBLIC_GIPHY_API_KEY;

    if (!API_KEY) {
      throw new Error("Missing Giphy API key");
    }

    return http.get<GiphyResponse>(
      `https://api.giphy.com/v1/stickers/trending?api_key=${API_KEY}&limit=${limit}&offset=${offset}&rating=g`,
    );
  },

  searchStickers: (query: string, limit: number = 20, offset: number = 0) => {
    const API_KEY = process.env.EXPO_PUBLIC_GIPHY_API_KEY;

    if (!API_KEY) {
      throw new Error("Missing Giphy API key");
    }

    return http.get<GiphyResponse>(
      `https://api.giphy.com/v1/stickers/search?api_key=${API_KEY}&q=${encodeURIComponent(
        query,
      )}&limit=${limit}&offset=${offset}&rating=g`,
    );
  },
};
