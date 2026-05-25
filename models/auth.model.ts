import { Gamification } from "./gamification.model";

export interface UserMetadata {
  display_name: string;
  email: string;
  email_verified: boolean;
  phone_verified: boolean;
  signup_via: string;
  sub: string;
  username?: string;
}
export interface User {
  id?: string;
  email?: string;
  name?: string;
  display_name?: string;
  username: string;
  bio: string;
  favourite_genres?: string[];
  notify?: boolean;
  avatar_url?: string;
  interests: string[];
  date_of_birth: string;
  role: string;
  created_at?: string;
  is_premium?: boolean;
  updated_at?: string;
  last_sign_in_at?: string;
  last_seen?: string;
  is_anonymous?: boolean;
  app_metadata?: AppMetadata;
  user_metadata?: UserMetadata;
  onboarding_completed?: boolean;
  gamification?: Gamification;
}

export interface AppMetadata {
  provider: string;
  providers: string[];
}
export interface LoginRequest {
  email: string;
  password: string;
  userAgent: string;
  ipAddress: string;
  location: string;
  deviceFingerprint: string;
  deviceType: string;
}
export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
  token_type: string;
  user: User;
  weak_password?: boolean | null;
}
export interface OnboardingStep<T = any> {
  data: T;
  completed: boolean;
}

export interface OnboardingSteps {
  date_of_birth?: OnboardingStep<string>;
  favourite_genres?: OnboardingStep<string[]>;
  interests?: OnboardingStep<string[]>;
}

export interface OnboardingMetadata {
  completed: boolean;
  steps: OnboardingSteps;
  steps_completed: string[];
}

export interface ProfileMetadata {
  onboarding?: OnboardingMetadata;
}
export interface LoginResponse {
  message: string;
  profile_metadata: ProfileMetadata;
  session: Session;
  status: number;
  success: boolean;
  user: User;
}

export interface SignUpRequest {
  email: string;
  password: string;
  date_of_birth?: string;
  display_name?: string;
  username?: string;
}

export interface SignUpResponse {
  message: string;
  user: User;
}
export interface ResponseData {
  message: string;
}
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  recoveryToken?: string;
  newPassword: string;
}
export interface LogoutReQuest {
  scope: "global" | "local";
}

export type UpdateProfilePayload = Partial<
  Pick<
    User,
    | "username"
    | "display_name"
    | "bio"
    | "name"
    | "favourite_genres"
    | "notify"
    | "avatar_url"
    | "role"
  >
>;
