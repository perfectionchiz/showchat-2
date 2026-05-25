import { useToast } from "@/components/context/ToastContext";
import { queryClient } from "@/lib/queryClient";
import { UpdatePreferencesResponse } from "@/models/user-preferences.model";
import { preferencesService } from "@/services/user.preference.service";
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQuery } from "@tanstack/react-query";

const QUERY_KEY = ["user-preferences"];

export const useUserPreferences = () => {
  const session = useAuthStore().session;
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => preferencesService.getPreferences(),
    select: (data: UpdatePreferencesResponse) => data.preferences,
    enabled: !!session?.access_token,
  });
};

export const useUpdatePreferences = () => {
  const { showToast } = useToast();
  return useMutation({
    mutationFn: preferencesService.updatePreferences,

    onSuccess: (data: UpdatePreferencesResponse, vars) => {
      queryClient.setQueryData(QUERY_KEY, data);

      let message = data.message || "Preferences updated successfully";

      if (vars?.silent_mode_default !== undefined) {
        message = `Silent mode updated successfully`;
      }

      if (vars?.opt_in_notifications !== undefined) {
        message = vars.opt_in_notifications
          ? `Notification preference turned on`
          : `Notification preference turned off`;
      }

      if (vars?.preferred_categories !== undefined) {
        message = `Notification categories updated`;
      }

      const keysUpdated = Object.keys(vars || {}).length;
      if (keysUpdated > 1) {
        message = "Notification settings saved";
      }

      showToast(message, "success");

      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (err: any) => {
      showToast(err?.message || "Failed to update user preferences", "error");
    },
  });
};
