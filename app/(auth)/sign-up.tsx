import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Mail } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/common/Button";
import FormWrapper from "@/components/forms/FormWrapper";
import { Input } from "@/components/forms/Input";
import { OAuthButton } from "@/components/ui/OAuthButton";

import { PRIMARY_COLOR } from "@/constants/constants";
import { useSignUp } from "@/hooks/auth/useSignUp";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function SignUpScreen() {
  const signUpMutation = useSignUp();
  const insets = useSafeAreaInsets();
  return (
    <FormWrapper
      containerStyle={{ paddingTop: insets.top }}
      header="Your front-row seat to the conversation"
      subtitle="Start watching live TV with fans"
      title="Create account"
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={SignUpSchema}
      onSubmit={async (values) => {
        signUpMutation.mutate(values);
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
            containerClassName="mb-6"
            error={touched.password ? errors.password : undefined}
          />

          <Button
            disabled={signUpMutation.isPending}
            isLoading={signUpMutation.isPending}
            textVariant="bold"
            onPress={() => handleSubmit()}
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            Create Account
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

          <View className="items-center mt-8">
            <View className="flex-row items-center">
              <Text className="text-muted-foreground text-base">
                Already have an account?{" "}
              </Text>
              <Button
                onPress={() => router.push("/sign-in")}
                variant="ghost"
                isLoading={false}
                textStyles={{ color: PRIMARY_COLOR }}
                className="p-0"
              >
                Sign in
              </Button>
            </View>
          </View>
        </>
      )}
    </FormWrapper>
  );
}
