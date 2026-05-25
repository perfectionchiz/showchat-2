import { useAuthStore } from "@/store/authStore";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthLoadingScreen } from "../ui/AuthLoader";

const PUBLIC_ROUTES = ["home", "chat", "guide"];

export function RouteGuard({
  children,
  onboardingComplete,
  isLoadingProfile,
}: {
  children: React.ReactNode;
  onboardingComplete: boolean;
  isLoadingProfile: boolean;
}) {
  const router = useRouter();
  const segments = useSegments();
  const { session, user } = useAuthStore();

  const isLoggedIn = !!session?.access_token;
  const isProfileReady = !isLoggedIn || (!isLoadingProfile && user !== null);

  useEffect(() => {
    if (!isProfileReady) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "onboarding";
    const isPublic = segments.some((s) => PUBLIC_ROUTES.includes(s));

    if (!isLoggedIn) {
      if (!inAuthGroup && !isPublic) {
        router.replace("/(auth)/sign-in");
      }
    } else if (!onboardingComplete) {
      if (!inOnboarding) {
        router.replace("/onboarding");
      }
    } else if (inAuthGroup || inOnboarding) {
      router.replace("/(tabs)/home");
    }
  }, [isLoggedIn, onboardingComplete, segments, isProfileReady]);

  if (!isProfileReady) {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
}
