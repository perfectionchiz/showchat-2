import { useToast } from "@/components/context/ToastContext";
import { queryClient } from "@/lib/queryClient";
import { CompleteOnboarding, GenresResponse } from "@/models/onboarding.model";
import { onboardingService } from "@/services/onboarding.service";
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetGenres = () => {
  return useQuery<GenresResponse>({
    queryKey: ["genres"],
    queryFn: () => onboardingService.getGenre(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCompleteOnboarding = (setStep?: (step: number) => void) => {
  const { showToast } = useToast();

  const setProfile = useAuthStore((s) => s.setProfile);

  return useMutation({
    mutationFn: (data: CompleteOnboarding) =>
      onboardingService.onboarding(data),

    onSuccess: (res) => {
      const profile = res.profile;

      setProfile({
        ...profile,
        onboarding_completed: profile.onboarding_completed,
      });
      queryClient.setQueryData(["profile"], (oldData: any) => {
        return {
          ...oldData,
          profile: {
            ...oldData?.profile,
            ...profile,
          },
        };
      });
      if (profile.onboarding_completed) {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        showToast("Welcome! Your profile is ready 🎉", "success");
      } else {
        let nextStep = 1;
        if (!profile.date_of_birth) nextStep = 1;
        else if (!profile.favourite_genres) nextStep = 2;
        else nextStep = 3;
        setStep?.(nextStep);
      }
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Onboarding failed";

      showToast(errorMessage, "error");
    },
  });
};
