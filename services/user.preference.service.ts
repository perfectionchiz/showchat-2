import { http } from "@/lib/httpHelper";
import { UpdatePreferencesResponse } from "@/models/user-preferences.model";

type UpdatePreferencesPayload = {
  silent_mode_default?: boolean;
  opt_in_notifications?: boolean;
  preferred_categories?: string[] | null;
};

export const preferencesService = {
  getPreferences: () => {
    return http.get<UpdatePreferencesResponse>("/user-preferences");
  },

  updatePreferences: (data: UpdatePreferencesPayload) => {
    return http.post<UpdatePreferencesResponse>("/user-preferences", data);
  },
};
