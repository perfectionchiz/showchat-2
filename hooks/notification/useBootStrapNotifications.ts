import { notificationService } from "@/services/notifications.service";
import { useQuery } from "@tanstack/react-query";

export const useBootstrapNotifications = (userId?: string) => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.getNotifications,
    enabled: !!userId,
    staleTime: 0,
  });
};
