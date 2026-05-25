import { channelsService } from "@/services/channels.service";
import { useQuery } from "@tanstack/react-query";

export const useGetChannelPage = (params?: {
  search?: string;
  slug?: string;
}) => {
  return useQuery({
    queryKey: ["channel-page", params?.search, params?.slug],

    queryFn: () =>
      channelsService.getChannelPage({
        ...params,
      }),

    enabled: !!params?.slug,
  });
};
