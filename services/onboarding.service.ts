import { http } from "@/lib/httpHelper";
import {
  CompleteOnboarding,
  CompleteOnboardingResponse,
  GenresResponse,
} from "@/models/onboarding.model";

export const onboardingService = {
  onboarding: (data: CompleteOnboarding) => {
    return http.post<CompleteOnboardingResponse>("/complete-onboarding", data);
  },
  getGenre: () => {
    return http.get<GenresResponse>("/genres");
  },
};
