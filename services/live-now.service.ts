import { http } from "@/lib/httpHelper";
import { GetLiveRoomsResponse } from "@/models/livechat.model";

export const liveService = {
  getLiveRooms: (params?: { search?: string; page?: number }) => {
    return http.get<GetLiveRoomsResponse>("/get-live-rooms", params);
  },
};
