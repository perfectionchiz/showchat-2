import { registerForPushNotifications } from "@/lib/push";
import { registerPushToken } from "@/services/push-notifications.service";
import { useMutation } from "@tanstack/react-query";
import { Platform } from "react-native";

export const useRegisterPushToken = () => {
  return useMutation({
    mutationKey: ["register-push-token"],

    mutationFn: async () => {
      const token = await registerForPushNotifications();

      if (!token) return;

      return registerPushToken({
        token,
        provider: "expo",
        device_type: Platform.OS === "ios" ? "ios" : "android",
      });
    },
  });
};
