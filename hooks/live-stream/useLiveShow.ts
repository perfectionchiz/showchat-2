import { LiveShow } from "@/models/livechat.model";
import { liveShows } from "@/utils/ambientActivity";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function useLiveShowsMock(search?: string) {
  const query = useQuery<LiveShow[], Error>({
    queryKey: ["liveShows"],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 500));
      return liveShows ?? [];
    },
  });

  const filteredShows = useMemo(() => {
    const data = query.data ?? [];

    if (!search?.trim()) return data;

    const q = search.toLowerCase();

    return data.filter((show) => {
      if (!show) return false;

      return (
        show.title?.toLowerCase().includes(q) ||
        show.description?.toLowerCase().includes(q)
      );
    });
  }, [query.data, search]);

  return {
    liveShows: filteredShows,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  };
}
