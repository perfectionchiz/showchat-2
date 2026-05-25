import { http } from "@/lib/httpHelper";
import { ChannelsResponse } from "@/models/channel.model";

export const channelsService = {
  getChannelPage: (params?: { search?: string; slug?: string }) => {
    return http.get<any>("/channel-page", params);
  },

  getChannelBrowsers: (params: { search?: string; page?: number }) => {
    return http.get<ChannelsResponse>("/channels-browser", params);
  },
};
