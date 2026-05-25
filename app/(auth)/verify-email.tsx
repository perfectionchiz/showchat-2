import { Button } from "@/components/common/Button";
import FormWrapper from "@/components/forms/FormWrapper";
import { Text } from "@/components/ui/Text";
import { useVerifyEmail } from "@/hooks/auth/useVerifyEmail";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { CheckCircle } from "lucide-react-native";
import React, { useEffect } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function VerifyEmailScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const verifyEmail = useVerifyEmail();

  useEffect(() => {
    if (token) {
      verifyEmail.mutate(token);
    }
  }, [token]);

  const isVerifying = !!token;

  const insets = useSafeAreaInsets();
  return (
    <FormWrapper
      containerStyle={{ paddingTop: insets.top }}
      header={isVerifying ? "Email Verified" : "Verify your email"}
      title={
        isVerifying
          ? "Your email has been successfully verified!"
          : "We’ve sent a verification link to your email"
      }
      subtitle={
        isVerifying
          ? "You can now access your account."
          : "Please check your inbox and click the link to verify your account."
      }
    >
      <View className="flex-col justify-center items-center gap-3">
        <View className="w-16 h-16 rounded-full bg-gray-800/70 items-center justify-center">
          {isVerifying ? (
            <CheckCircle size={30} color="green" />
          ) : (
            <Ionicons name="mail-outline" size={30} color="#fff" />
          )}
        </View>

        <Text variant="semibold" className="text-xl text-white">
          {isVerifying ? "Email Verified Successfully" : "Check your email"}
        </Text>

        <Button
          onPress={() => router.push("/sign-in")}
          className="border border-gray-800 w-full mt-5"
          variant="tertiary"
        >
          {isVerifying ? "Proceed to login" : "Go to login"}
        </Button>
      </View>
    </FormWrapper>
  );
}
