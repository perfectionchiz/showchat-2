import { notificationService } from "@/services/notifications.service";
import { useQuery } from "@tanstack/react-query";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.getNotifications,
  });
};
