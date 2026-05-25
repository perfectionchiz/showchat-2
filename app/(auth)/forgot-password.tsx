import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { CheckCircle, Mail } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

import { Button } from "@/components/common/Button";
import FormWrapper from "@/components/forms/FormWrapper";
import { Input } from "@/components/forms/Input";
import { Text } from "@/components/ui/Text";

import { PRIMARY_COLOR } from "@/constants/constants";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPasswordScreen() {
  const { mutation: forgotPasswordMutation, isReset } = useForgotPassword();
  const insets = useSafeAreaInsets();
  return (
    <FormWrapper
      containerStyle={{ paddingTop: insets.top }}
      header="Your front-row seat to the conversation"
      subtitle="Enter your email and we'll send you a reset link"
      title="Reset Password"
      initialValues={{ email: "" }}
      validationSchema={ForgotPasswordSchema}
      onSubmit={(values) => {
        forgotPasswordMutation.mutate(values);
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
        <View>
          {isReset ? (
            <View className="flex-col justify-center items-center gap-3">
              <View className="w-16 h-16 rounded-full bg-gray-800/70 items-center justify-center">
                <CheckCircle size={30} color="green" />
              </View>
              <Text variant="semibold" className="text-xl text-white">
                Check your email
              </Text>
              <Text className="text-gray-400">
                We&apos;ve sent a password reset link to
              </Text>
              <Text variant="semibold" className="text-white text-lg">
                {values.email}
              </Text>
              <Button
                onPress={() => router.push("/sign-in")}
                icon={<Ionicons name="arrow-back" size={20} color="#fff" />}
                className="border border-gray-800 w-full mt-5"
                variant="tertiary"
                isLoading={false}
              >
                Back to sign in
              </Button>
            </View>
          ) : (
            <View className="w-full">
              <Input
                label="Email"
                placeholder="you@example.com"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Mail size={20} color="#9ca3af" />}
                inputClassName="text-white mb-6"
                error={touched.email ? errors.email : undefined}
              />
              <Button
                textVariant="bold"
                style={{ backgroundColor: PRIMARY_COLOR }}
                isLoading={forgotPasswordMutation.isPending}
                disabled={forgotPasswordMutation.isPending}
                onPress={() => handleSubmit()}
              >
                Send Reset Link
              </Button>
              <Button
                onPress={() => router.push("/sign-in")}
                variant="ghost"
                isLoading={false}
                className="flex mt-4 justify-start"
                icon={<Ionicons name="arrow-back" size={20} color="#9ca3af" />}
                textClassName="text-gray-400"
              >
                Back to login
              </Button>
            </View>
          )}
        </View>
      )}
    </FormWrapper>
  );
}
