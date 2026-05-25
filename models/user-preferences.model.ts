export interface UserPreferences {
  id: string;
  user_id: string;
  silent_mode_default: boolean;
  opt_in_notifications: boolean;
  preferred_categories: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface UpdatePreferencesResponse {
  message: string;
  success: boolean;
  status: number;
  preferences: UserPreferences;
}
