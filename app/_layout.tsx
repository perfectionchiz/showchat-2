import { RouteGuard } from "@/components/auth/RouteGuard";
import { ToastProvider } from "@/components/context/ToastContext";
import { useBootstrapNotifications } from "@/hooks/notification/useBootStrapNotifications";
import { useRealtimeNotifications } from "@/hooks/notification/useRealTimeNotification";
import { useRegisterPushToken } from "@/hooks/notification/useRegisterPushNotification";
import { useGetProfile } from "@/hooks/profile/useGetUserProfile";
import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/store/authStore";
import { fetchClientMetadata } from "@/utils/getClientMetadata";
import {
  DMSans_300Light,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  useFonts,
} from "@expo-google-fonts/dm-sans";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

SplashScreen.preventAutoHideAsync();
function AppContent() {
  const { session, user, setMetadata, isOnboarded } = useAuthStore();
  const { data: profile, isLoading } = useGetProfile();

  const onboardingComplete =
    isOnboarded || profile?.profile.onboarding_completed || false;

  useRealtimeNotifications(user?.id);
  useBootstrapNotifications(user?.id);

  const { mutate: registerPush } = useRegisterPushToken();
  const hasRegistered = useRef(false);

  useEffect(() => {
    if (session?.access_token && !hasRegistered.current) {
      registerPush();
      hasRegistered.current = true;
    }
  }, [session]);

  useEffect(() => {
    const init = async () => {
      const data: any = await fetchClientMetadata();
      setMetadata(data);
    };
    init();
  }, [setMetadata]);
  return (
    <RouteGuard
      onboardingComplete={onboardingComplete}
      isLoadingProfile={session?.access_token ? isLoading : false}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </RouteGuard>
  );
}
export default function RootLayout() {
  const [loaded, error] = useFonts({
    "DMSans-Light": DMSans_300Light,
    "DMSans-Regular": DMSans_400Regular,
    "DMSans-Medium": DMSans_500Medium,
    "DMSans-SemiBold": DMSans_600SemiBold,
    "DMSans-Bold": DMSans_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
    if (loaded) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#0b1220" }}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <SafeAreaProvider>
            <BottomSheetModalProvider>
              <AppContent />
            </BottomSheetModalProvider>
          </SafeAreaProvider>
        </ToastProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
