import { User } from "./auth.model";

export interface Genre {
  id: string;
  name: string;
}

export interface GenresResponse {
  message: string;
  success: boolean;
  status: number;
  genres: Genre[];
}
export interface CompleteOnboarding {
  date_of_birth?: string | null;
  favourite_genres?: string[];
  interests?: string[];
}
export interface CompleteOnboardingResponse {
  message: string;
  success: boolean;
  status: number;
  profile: User;
}
