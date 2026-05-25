import { useAuthStore } from "@/store/authStore";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { supabase } from "../lib/supabase";

WebBrowser.maybeCompleteAuthSession();
const redirectTo = makeRedirectUri({
  scheme: "showchats",
});

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);

  const { access_token, refresh_token, expires_at } = params as {
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
  };

  if (!access_token || !refresh_token) return;

  const { error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) throw error;
  useAuthStore.getState().setSession({
    access_token,
    refresh_token,
    expires_at: expires_at ?? Date.now() + 3600 * 1000,
  });
};

export const oAuthService = {
  async handleDeepLink(url: string) {
    return createSessionFromUrl(url);
  },

  async initDeepLinkListener() {
    const initialUrl = await Linking.getInitialURL();
    if (initialUrl) await createSessionFromUrl(initialUrl);

    const subscription = Linking.addEventListener("url", async ({ url }) => {
      await createSessionFromUrl(url);
    });

    return () => subscription.remove();
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: Platform.OS !== "web",

        queryParams: { prompt: "select_account" },
      },
    });

    if (error) throw error;

    if (!data?.url) return { success: false };

    const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    if (res.type === "success" && res.url) {
      await createSessionFromUrl(res.url);
      return { success: true };
    }

    return { success: false };
  },

  async signInWithApple() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;

    if (!data?.url) return { success: false };

    const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    if (res.type === "success" && res.url) {
      await createSessionFromUrl(res.url);
      return { success: true };
    }

    return { success: false };
  },

  async signOut() {
    await supabase.auth.signOut();
  },
};
