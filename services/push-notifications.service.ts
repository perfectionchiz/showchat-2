import { http } from "@/lib/httpHelper";
import { supabase } from "@/lib/supabase";
import { Notification } from "@/models/notifications";

export type RegisterPushTokenPayload = {
  token: string;
  provider: "expo";
  device_type: "ios" | "android";
};

export type RegisterPushTokenResponse = {
  success: boolean;
};

export const registerPushToken = (payload: RegisterPushTokenPayload) => {
  return http.post<RegisterPushTokenResponse, RegisterPushTokenPayload>(
    "/register-push-token",
    payload,
  );
};
export const getNotifications = async (): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};
