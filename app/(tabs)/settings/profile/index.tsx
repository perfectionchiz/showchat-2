import { IconButton } from "@/components/common/IconButton";
import { AchievementShowcase } from "@/components/profile/badges/AchievementBadgePage";
import { BioCard } from "@/components/profile/BioCard";
import { FriendList } from "@/components/profile/friends/FriendList";
import { FriendsCard } from "@/components/profile/FriendsCard";
import { GamificationCard } from "@/components/profile/GamificationCard";
import { GenresCard } from "@/components/profile/GenresCard";
import { UserInfoCard } from "@/components/profile/UserInfoCard";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";
import SafeAreaWrapper from "@/components/ui/SafeAreaWrapper";
import SkeletonCircle from "@/components/ui/skeleton/SkeletonCircle";
import { PRIMARY_COLOR } from "@/constants/constants";
import { useInviteFriends } from "@/hooks/invite/useInvite";
import { useGetFriends } from "@/hooks/profile/useGetFriends";
import { useGetProfile } from "@/hooks/profile/useGetUserProfile";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

import { ScrollView, View } from "react-native";

export default function Profile() {
  const { data, isProfileLoading } = useGetProfile();
  const { data: friendlist, isLoading } = useGetFriends();
  const profile = data?.profile;
  const [isSubOpen, setIsSubOpen] = useState(false);
  const [isOpenAchievement, setIsOpenAchievement] = useState(false);
  const [isFriendList, setIsFriendlistOpen] = useState(false);
  const { mutate: sendInvite, isPending } = useInviteFriends();
  return (
    <SafeAreaWrapper>
      <View className="flex-1">
        <SettingsHeader
          showBorder={false}
          extraChild={
            <View>
              {isProfileLoading ? (
                <SkeletonCircle size={30} />
              ) : (
                <IconButton
                  style={{ backgroundColor: PRIMARY_COLOR }}
                  size={36}
                  className="bg-[#0EA5E9] rounded-full"
                  onPress={() =>
                    router.replace("/settings/profile/edit-profile")
                  }
                  icon={
                    <Ionicons
                      name="pencil-outline"
                      size={20}
                      fill={"#fff"}
                      color={"#fff"}
                    />
                  }
                />
              )}
            </View>
          }
          back={() => router.replace("/settings")}
        >
          Profile
        </SettingsHeader>

        <View>
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 40,
              paddingHorizontal: 12,
            }}
            showsVerticalScrollIndicator={false}
          >
            <GamificationCard
              profile={profile}
              loading={isProfileLoading}
              openSub={setIsSubOpen}
              openBadge={setIsOpenAchievement}
              gamification={profile?.gamification}
            />

            <GenresCard
              genres={profile?.favourite_genres}
              loading={isProfileLoading}
            />

            <BioCard
              bio={profile?.bio}
              email={profile?.email}
              loading={isProfileLoading}
              createdAt={profile?.created_at}
            />
            <FriendsCard
              setOpen={() => setIsFriendlistOpen(true)}
              loading={isProfileLoading}
              friendList={friendlist?.friends ?? []}
              onInvite={sendInvite}
              isPendingInvite={isPending}
            />
            <UserInfoCard
              username={profile?.username}
              displayName={profile?.display_name}
              loading={isProfileLoading}
            />
          </ScrollView>
        </View>
      </View>
      <SubscriptionPlans open={isSubOpen} setOPen={setIsSubOpen} />
      <AchievementShowcase
        isOpen={isOpenAchievement}
        setClose={() => setIsOpenAchievement(false)}
        badges={profile?.gamification?.badges || []}
      />
      <FriendList
        loading={isLoading}
        isPendingInvite={isPending}
        friends={friendlist?.friends || []}
        open={isFriendList}
        setOPen={setIsFriendlistOpen}
        onInvite={sendInvite}
      />
    </SafeAreaWrapper>
  );
}
