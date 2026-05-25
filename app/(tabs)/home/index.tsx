import DebouncedSearchInput from "@/components/forms/SearchInput";
import { HeroBanner } from "@/components/layout/HeroBanner";
import AlsoLive from "@/components/live/AlsoLive";
import LiveHeader from "@/components/live/LiveHeader";
import { mapToLiveStream } from "@/components/live/MapLiveStream";
import { AppHeader } from "@/components/ui/AppHeader";
import SkeletonText from "@/components/ui/skeleton/SkeletonText";
import { Text } from "@/components/ui/Text";
import { UserMomentBanner } from "@/components/ui/UserMomentBanner";
import { useGetLiveRoomsInfinite } from "@/hooks/live-stream/useLiveNow";
import { useNotificationActions } from "@/hooks/notification/useNotificationActions";
import { useUnreadCount } from "@/hooks/notification/useUnreadCount";
import { useGetProfile } from "@/hooks/profile/useGetUserProfile";
import { useUserMoments } from "@/hooks/profile/useUserMoments";

import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import { TrendingUp } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { Platform, View } from "react-native";

const Home = () => {
  const [search, setSearch] = useState("");
  const { data: profileData } = useGetProfile();
  const { data: unreadCount } = useUnreadCount();
  const { markAllAsRead } = useNotificationActions(false);
  const session = useAuthStore((state) => state.session);
  const isLoggedIn = session?.access_token;
  const streak =
    profileData?.profile?.gamification?.current_streak ??
    profileData?.profile?.gamification?.longest_streak ??
    0;
  const lastSeen = profileData?.profile?.last_seen || "";
  const xp = profileData?.profile?.gamification?.xp || 0;
  const level = profileData?.profile?.gamification?.level || 1;
  const next_level = profileData?.profile?.gamification?.xp_to_next_level || 0;
  const { activeMoment, extraData, dismiss } = useUserMoments({
    streak: streak,
    lastSeen: lastSeen,
    xp: xp,
    level: level,
    xpToNextLevel: next_level,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useGetLiveRoomsInfinite(search);
  const liveRooms = useMemo(() => {
    return data?.pages.flatMap((p) => p.data?.also_live ?? []) ?? [];
  }, [data]);

  const trendingRooms = useMemo(() => {
    return data?.pages?.[0]?.data?.hero ?? [];
  }, [data]);
  const trendingStreams = useMemo(
    () => trendingRooms.map(mapToLiveStream),
    [trendingRooms],
  );

  const liveStreams = useMemo(
    () => liveRooms.map(mapToLiveStream),
    [liveRooms],
  );

  const renderHeader = useCallback(
    () => (
      <AppHeader
        isLoggedIn={!!session?.access_token}
        badge={unreadCount ?? 0}
        onProfilePress={() => router.push("/settings/profile")}
        profile={profileData?.profile}
        markAllAsRead={() => markAllAsRead.mutate()}
      />
    ),
    [session?.access_token, unreadCount, profileData?.profile],
  );

  return (
    <View
      className="bg-background flex-1"
      style={{ paddingBottom: Platform.OS === "ios" ? 90 : 70 }}
    >
      {renderHeader()}
      <AlsoLive
        liveStreams={liveStreams}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        listHeaderComponent={
          <View className="p-4">
            <UserMomentBanner
              isVisible={!!isLoggedIn}
              type={activeMoment}
              streak={streak}
              extraData={extraData}
              dismiss={() => dismiss(activeMoment)}
            />

            <View className="mt-2">
              <LiveHeader rooms={liveStreams} />

              <DebouncedSearchInput
                onSearch={setSearch}
                initialValue={search}
                placeholder="Search..."
              />

              <View className="mt-3 flex-row items-center gap-3">
                <TrendingUp size={15} color={"#95A3B8"} />
                <Text
                  variant="medium"
                  className="text-muted-foreground text-lg"
                >
                  MOST ACTIVE
                </Text>
              </View>

              <View className="mt-3">
                {isLoading ? (
                  <SkeletonText height={200} />
                ) : (
                  <HeroBanner setSearch={setSearch} rooms={trendingStreams} />
                )}
              </View>

              <View className="mt-1">
                <Text
                  variant="medium"
                  className="text-muted-foreground text-lg"
                >
                  ALSO LIVE
                </Text>
              </View>
            </View>
          </View>
        }
      />
    </View>
  );
};

export default Home;
