import { Button } from "@/components/common/Button";
import FormWrapper from "@/components/forms/FormWrapper";
import { Input } from "@/components/forms/Input";
import { PRIMARY_COLOR } from "@/constants/constants";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";
const ResetPasswordSchema = Yup.object().shape({
  recoveryToken: Yup.string().required("Token is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function ResetPasswordScreen() {
  const { mutate, isPending } = useResetPassword();
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const handleUrl = (url: string | null) => {
      if (!url) return;
      const hash = url.split("#")[1];
      if (hash) {
        const params = new URLSearchParams(hash);
        const token = params.get("access_token");
        const type = params.get("type");

        if (token) {
          setAccessToken(token);
        }
      }
    };

    Linking.getInitialURL().then((url) => handleUrl(url));

    const subscription = Linking.addEventListener("url", (event) => {
      handleUrl(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, []);
  const insets = useSafeAreaInsets();
  return (
    <FormWrapper
      containerStyle={{ paddingTop: insets.top }}
      header="Your front-row seat to the conversation"
      subtitle="Create new password"
      title="Reset Password"
      initialValues={{
        recoveryToken: accessToken || "",
        newPassword: "",
        confirmPassword: "",
      }}
      validationSchema={ResetPasswordSchema}
      onSubmit={(values) => {
        mutate(values);
      }}
    >
      {({
        values,
        handleChange,
        handleBlur,
        errors,
        touched,
        isValid,
        handleSubmit,
      }) => (
        <>
          <Input
            label="Password"
            placeholder="••••••••"
            value={values.newPassword}
            onChangeText={handleChange("newPassword")}
            onBlur={handleBlur("newPassword")}
            secureTextEntry
            secureTextEntryToggle
            inputClassName="text-white"
            leftIcon={
              <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
            }
            containerClassName="mb-6 "
            error={touched.newPassword ? errors.newPassword : undefined}
          />

          <Input
            label="Confirm Password"
            placeholder="••••••••"
            value={values.confirmPassword}
            onChangeText={handleChange("confirmPassword")}
            onBlur={handleBlur("confirmPassword")}
            secureTextEntry
            secureTextEntryToggle
            inputClassName="text-white"
            leftIcon={
              <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
            }
            containerClassName="mb-6"
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
          />

          <Button
            textVariant="bold"
            variant="secondary"
            isLoading={isPending}
            disabled={!isValid}
            style={{ backgroundColor: PRIMARY_COLOR }}
            onPress={() => handleSubmit()}
          >
            Reset Password
          </Button>
        </>
      )}
    </FormWrapper>
  );
}
