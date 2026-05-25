export interface Badge {
  badge_type: string;
  badge_name: string;
  badge_description: string;
  earned_at: string;
}

export interface Gamification {
  xp: number;
  level: number;
  level_name: string;
  current_streak: number;
  longest_streak: number;
  badges: Badge[];
  xp_to_next_level: number;
}
