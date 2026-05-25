import { Button } from "@/components/common/Button";
import { ConfirmModal } from "@/components/common/ConfirmAlertModal";
import { SessionCard } from "@/components/settings/SessionCard";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import SafeAreaWrapper from "@/components/ui/SafeAreaWrapper";
import { Text } from "@/components/ui/Text";
import {
  useAuthSessions,
  useDeleteSession,
} from "@/hooks/auth/useAuthSessions";
import { useLogout } from "@/hooks/auth/useLogout";
import { useConfirm } from "@/hooks/useAlert";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

const DeviceScreen = () => {
  const { data, isLoading } = useAuthSessions();
  const { mutateAsync: deleteSession } = useDeleteSession();
  const { mutateAsync } = useLogout();
  const { confirm, ConfirmModalProps } = useConfirm();

  const handleLogout = () => {
    confirm(
      "Log Out",
      "This will log you out from all your devices. Continue?",
      async () => {
        try {
          await mutateAsync({ scope: "global" });
        } catch (error) {
          console.log(error);
        }
      },
    );
  };
  const handleDelete = (id: string) => {
    confirm(
      "Remove Device",
      "Note this action is irreversible. Continue?",
      async () => {
        try {
          await deleteSession(id);
        } catch (error) {
          console.log(error);
        }
      },
    );
  };

  const allDevices = useMemo(() => {
    if (!data) return [];

    const current = data?.current_device ? [data.current_device] : [];
    const others = data?.other_devices || [];

    return [...current, ...others];
  }, [data]);
  return (
    <SafeAreaWrapper>
      <View className="flex-1">
        <SettingsHeader back={() => router.replace("/settings")}>
          Devices
        </SettingsHeader>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View className="px-5 pt-5">
            <Text className="text-gray-300 text-sm mt-2 leading-5">
              Manage devices currently logged into your account. If you see a
              device you don’t recognize, you can log it out immediately.
            </Text>
          </View>

          <View className="mt-7 px-5">
            {isLoading ? (
              <ActivityIndicator color="#fff" className="mt-5" />
            ) : (
              <View className="gap-y-6">
                <View>
                  <Text className="text-gray-400 uppercase text-xs tracking-widest mb-3">
                    Current Session
                  </Text>
                  <View className="gap-y-3">
                    {allDevices
                      .filter((d) => d?.is_current)
                      .map((device) => (
                        <SessionCard
                          key={device.id}
                          device={device}
                          isCurrent
                        />
                      ))}
                  </View>
                </View>

                {data?.other_devices.length ? (
                  <View className="mt-6">
                    <Text className="text-gray-400 uppercase text-xs tracking-widest mb-3">
                      Other Sessions
                    </Text>
                    <View className="gap-y-3">
                      {allDevices
                        .filter((d) => !d.is_current)
                        .map((device) => (
                          <SessionCard
                            key={device.id}
                            device={device}
                            onDelete={handleDelete}
                          />
                        ))}
                    </View>
                  </View>
                ) : null}
              </View>
            )}
          </View>
          {allDevices.length ? (
            <View className="mt-8 px-10">
              <Button
                variant="secondary"
                textVariant="semibold"
                size="lg"
                onPress={handleLogout}
                textClassName="text-base"
                icon={
                  <Ionicons
                    color={"#fff"}
                    name="phone-portrait-outline"
                    size={20}
                  />
                }
              >
                Log Out All Devices
              </Button>

              <Text className="text-muted-foreground text-xs text-center mt-3 leading-5">
                This will log your account out from all other active sessions.
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
      <ConfirmModal destructive {...ConfirmModalProps} />
    </SafeAreaWrapper>
  );
};

export default DeviceScreen;
