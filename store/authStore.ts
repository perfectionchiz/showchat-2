import { queryClient } from "@/lib/queryClient";
import { supabase } from "@/lib/supabase";
import { User } from "@/models/auth.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface ClientMetadata {
  ipAddress: string;
  userAgent: string;
  location: string;
  deviceFingerprint: string;
  deviceType: "mobile" | "tablet" | "other";
}

interface AuthState {
  user: User | null;
  session: Session | null;
  isOnboarded: boolean;
  metadata: ClientMetadata | null;

  setSession: (session: Session) => void;
  setProfile: (profile: Partial<User>) => void;
  setOnboarded: (value: boolean) => void;
  setMetadata: (metadata: ClientMetadata) => void;
  clearAll: () => void;
}
const resetBanners = async () => {
  try {
    await AsyncStorage.multiRemove([
      "moment-streak-dismissed",
      "moment-xp-dismissed",
      "moment-level-dismissed",
      "last-known-level",
    ]);
  } catch (e) {
    console.error("Failed to clear banner keys", e);
  }
};
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isOnboarded: false,
      metadata: null,

      setSession: (session) =>
        set(() => ({
          session,
        })),

      setMetadata: (metadata) =>
        set(() => ({
          metadata,
        })),

      setProfile: (profile) =>
        set((state) => {
          const updatedUser = state.user
            ? {
                ...state.user,
                ...profile,
                profile_url:
                  (profile as any).avatar_url ?? state.user.avatar_url,
              }
            : (profile as User);

          return {
            user: updatedUser,
            isOnboarded: Boolean(updatedUser?.onboarding_completed),
          };
        }),

      setOnboarded: (value: boolean) =>
        set((state) => ({
          isOnboarded: value,
          user: state.user
            ? { ...state.user, onboarding_completed: value }
            : state.user,
        })),

      clearAll: async () => {
        try {
          await Promise.allSettled([
            supabase.auth.signOut(),
            supabase.removeAllChannels(),
            resetBanners(),
          ]);
        } catch (error) {
          console.error("Logout process encountered an error:", error);
        } finally {
          set({
            user: null,
            session: null,
            isOnboarded: false,
          });
          requestAnimationFrame(() => {
            queryClient.clear();
          });
        }
      },
    }),

    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isOnboarded: state.isOnboarded,
        metadata: state.metadata,
      }),
    },
  ),
);
