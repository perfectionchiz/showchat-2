import { UserAvatar } from "@/components/chat/UserAvatar";
import { Button } from "@/components/common/Button";
import { IconButton } from "@/components/common/IconButton";
import { BaseModal } from "@/components/ui/BaseModal";
import EmptyState from "@/components/ui/EmptyState";
import SkeletonCircle from "@/components/ui/skeleton/SkeletonCircle";
import SkeletonText from "@/components/ui/skeleton/SkeletonText";
import { Text } from "@/components/ui/Text";
import { PRIMARY_COLOR } from "@/constants/constants";
import { FriendList as FriendListData } from "@/models/friends.model";
import { getInitials } from "@/utils/getInitials";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity, View } from "react-native";

interface FriendListProps {
  open: boolean;
  setOPen: (open: boolean) => void;
  friends: FriendListData[];
  onInvite?: () => void;
  loading: boolean;
  isPendingInvite: boolean;
}

export function FriendList({
  open,
  setOPen,
  friends,
  onInvite,
  loading,
  isPendingInvite,
}: FriendListProps) {
  return (
    <BaseModal
      isOpen={open}
      onClose={() => {
        setOPen(false);
      }}
      snapPoints={["95%"]}
    >
      <View className="flex-1 ">
        <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
          <IconButton
            onPress={() => setOPen(false)}
            icon={<Ionicons color="#E5E7EB" size={20} name="arrow-back" />}
          />

          <Text variant="semibold" className="text-lg text-white">
            Friends
          </Text>

          <IconButton
            style={{ opacity: 0 }}
            className="bg-[#111827]  rounded-full"
            onPress={() => {}}
            icon={
              <Ionicons color="#C7CCD6" size={20} name="ellipsis-horizontal" />
            }
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View className="mx-4 mt-2 bg-primary rounded-3xl p-4 border border-white/5">
            <View className="flex-row items-start">
              <View className="w-11 h-11 rounded-2xl bg-[#5865F2]/20 items-center justify-center">
                <Ionicons name="person-add" size={22} color="#818CF8" />
              </View>

              <View className="ml-3 flex-1">
                <Text variant="semibold" className="text-white text-[15px]">
                  Invite your friends
                </Text>

                <View>
                  <Text className="text-zinc-300 text-[13px] leading-5 mt-1">
                    Share invitation link to friends on your social platforms
                    todays.
                  </Text>
                  {friends.length !== 0 ? (
                    <Button
                      onPress={() => onInvite?.()}
                      textStyles={{ color: PRIMARY_COLOR }}
                      className="h-6 px-0  justify-end"
                      isLoading={isPendingInvite}
                      icon={
                        <Ionicons name="link" color={PRIMARY_COLOR} size={17} />
                      }
                    >
                      Invite friends
                    </Button>
                  ) : null}
                </View>
              </View>
            </View>
          </View>

          <View className="mt-7 px-4">
            {friends.length ? (
              <Text className="text-zinc-300 uppercase tracking-widest text-[11px] mb-3">
                Friends
              </Text>
            ) : null}
            {loading ? (
              <View className="bg-primary border border-white/5 rounded-xl px-4 py-4 gap-y-5">
                {[1, 2, 3].map((item) => (
                  <View key={item} className="flex-row items-center">
                    <View className="mb-2">
                      <SkeletonCircle size={35} />
                    </View>

                    <View className="ml-3 flex-1">
                      <SkeletonText width={120} height={12} />

                      <View className="mt-2">
                        <SkeletonText width={180} height={10} />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : friends.length > 0 ? (
              <View className="bg-primary border border-white/5 rounded-xl">
                {friends.map((friend, index) => (
                  <TouchableOpacity
                    key={friend.id}
                    activeOpacity={0.8}
                    className={`flex-row items-center justify-between px-4 py-3 ${
                      index !== friends.length - 1
                        ? "border-b border-white/5"
                        : ""
                    }`}
                  >
                    <View className="flex-row items-center flex-1">
                      <View className="w-12 h-12 rounded-full bg-[#1F2937] items-center justify-center">
                        <UserAvatar
                          size={36}
                          getInitials={getInitials}
                          profileUrl={friend.avatar_url ?? ""}
                          displayName={friend.display_name || ""}
                        />
                      </View>

                      <View className="ml-3 flex-1">
                        <Text
                          variant="medium"
                          className="text-white text-[15px]"
                        >
                          {friend.display_name}
                        </Text>

                        <Text className="text-zinc-400 text-[12px] mt-0.5">
                          {friend.bio}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <EmptyState
                title="No friends found"
                description="When you have friends, they’ll appear here."
                icon={
                  <Ionicons name="people-outline" size={32} color="#94A3B8" />
                }
                buttonIcon={<Ionicons name="link" size={20} color="#fff" />}
                buttonText="Invite friends"
                loading={isPendingInvite}
                onButtonPress={() => {
                  onInvite?.();
                }}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </BaseModal>
  );
}
