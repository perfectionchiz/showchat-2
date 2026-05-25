import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Mail } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

import { Button } from "@/components/common/Button";
import FormWrapper from "@/components/forms/FormWrapper";
import { Input } from "@/components/forms/Input";
import { OAuthButton } from "@/components/ui/OAuthButton";
import { Text } from "@/components/ui/Text";

import { PRIMARY_COLOR } from "@/constants/constants";
import { useSignIn } from "@/hooks/auth/useSignIn";
import { fetchClientMetadata } from "@/utils/getClientMetadata";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginScreen() {
  const signInMutation = useSignIn();
  const insets = useSafeAreaInsets();
  return (
    <FormWrapper
      containerStyle={{ paddingTop: insets.top }}
      header="Your front-row seat to the conversation"
      subtitle="Sign in to join the conversation"
      title="Welcome back"
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={async (values) => {
        const freshMetadata = await fetchClientMetadata(true);
        signInMutation.mutateAsync({
          ...values,
          userAgent: freshMetadata.userAgent,
          ipAddress: freshMetadata.ipAddress,
          location: freshMetadata.location,
          deviceFingerprint: freshMetadata.deviceFingerprint,
          deviceType: freshMetadata.deviceType,
        });
      }}
    >
      {({
        values,
        handleChange,
        handleBlur,
        errors,
        touched,
        handleSubmit,
      }) => (
        <>
          <Input
            label="Email"
            placeholder="you@example.com"
            value={values.email}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color="#9ca3af" />}
            inputClassName="text-white"
            containerClassName="mb-5"
            error={touched.email ? errors.email : undefined}
          />

          <Input
            label="Password"
            placeholder="••••••••"
            value={values.password}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            secureTextEntry
            secureTextEntryToggle
            inputClassName="text-white"
            leftIcon={
              <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
            }
            containerClassName=""
            error={touched.password ? errors.password : undefined}
          />

          <Button
            onPress={() => router.push("/forgot-password")}
            variant="ghost"
            className="p-0 justify-end flex-row"
            textClassName="text-muted-foreground"
          >
            Forgot your password?
          </Button>
          <Button
            disabled={signInMutation.isPending}
            isLoading={signInMutation.isPending}
            textVariant="bold"
            style={{ backgroundColor: PRIMARY_COLOR }}
            onPress={() => handleSubmit()}
            variant="secondary"
          >
            Sign In
          </Button>

          <View className="flex-row items-center mt-4 mb-6">
            <View className="flex-1 h-px bg-gray-700" />
            <Text className="text-muted-foreground px-4 text-sm">
              or continue with
            </Text>
            <View className="flex-1 h-px bg-gray-700" />
          </View>

          <View className="flex-col gap-2">
            <OAuthButton provider="google" />
            <OAuthButton provider="apple" />
          </View>

          <View className="items-center mt-2">
            <View className="flex-row items-center">
              <Text className="text-muted-foreground text-base">
                Don&apos;t have an account?{" "}
              </Text>
              <Button
                onPress={() => router.push("/sign-up")}
                variant="ghost"
                isLoading={false}
                textStyles={{ color: PRIMARY_COLOR }}
                className="p-0"
              >
                Sign up
              </Button>
            </View>
          </View>
        </>
      )}
    </FormWrapper>
  );
}
