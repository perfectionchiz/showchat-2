import { useToast } from "@/components/context/ToastContext";
import { queryClient } from "@/lib/queryClient";
import { UpdateProfilePayload } from "@/models/auth.model";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";

export function useUpdateProfile() {
  const { user, setProfile, session } = useAuthStore();
  const { showToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      userService.updateProfile(payload),

    onSuccess: (res) => {
      setProfile(res.profile);
      showToast("Your profile has been updated successfully!", "success");
      router.replace("/settings/profile");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },

    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update profile";

      showToast(errorMessage, "error");
    },
  });

  const handleUpdateProfile = async (
    payload: UpdateProfilePayload,
    file?: { uri: string; name: string; type: string },
  ) => {
    try {
      let finalPayload = { ...payload };

      if (file?.uri) {
        setIsUploading(true);
        const accessToken = session?.access_token;

        if (!accessToken) {
          throw new Error("User not authenticated");
        }
        const res = await userService.uploadAvatar(
          file,
          "avatars",
          accessToken,
        );

        finalPayload.avatar_url = res.avatar_url;

        setIsUploading(false);
      }

      await updateMutation.mutateAsync(finalPayload);
    } catch (err: any) {
      setIsUploading(false);
      showToast(err.message || "An unexpected error occurred", "error");
    }
  };

  return {
    profile: user,
    updateProfile: handleUpdateProfile,
    isUpdating: updateMutation.isPending || isUploading,
  };
}
