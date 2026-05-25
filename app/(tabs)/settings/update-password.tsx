import { Button } from "@/components/common/Button";
import FormWrapper from "@/components/forms/FormWrapper";
import { Input } from "@/components/forms/Input";
import { RequirementItem } from "@/components/settings/RequirementItem";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { Text } from "@/components/ui/Text";
import { PRIMARY_COLOR } from "@/constants/constants";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { router } from "expo-router";
import { Save, ShieldCheck } from "lucide-react-native";
import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";

const PasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain a special character",
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm your new password"),
});

export default function UpdatePasswordForm() {
  const { mutate, isPending } = useResetPassword(true);
  const { back } = router;
  const hasUpperCase = (str: string) => /[A-Z]/.test(str);
  const hasSpecialChar = (str: string) => /[!@#$%^&*(),.?":{}|<> ]/.test(str);
  const formikRef = useRef<any>(null);
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-background">
      <SettingsHeader
        back={back}
        extraChild={
          <Button
            icon={<Save size={18} color={PRIMARY_COLOR} />}
            variant="ghost"
            textStyles={{ color: PRIMARY_COLOR }}
            isLoading={isPending}
            textClassName="text-secondary font-bold"
            onPress={() => formikRef?.current?.handleSubmit()}
          >
            Save
          </Button>
        }
      >
        Security
      </SettingsHeader>
      <FormWrapper
        initialValues={{ newPassword: "", confirmPassword: "" }}
        validationSchema={PasswordSchema}
        onSubmit={(values) => mutate({ newPassword: values.newPassword })}
        ref={formikRef}
      >
        {({ values, handleChange, handleBlur, errors, touched }) => (
          <View className="flex-1 bg-background">
            <View className="px-6">
              <View className="mt-4 mb-4">
                <Text variant="bold" className="text-white text-xl">
                  Update Password
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                  Ensure your account stays secure by using a strong, unique
                  password.
                </Text>
              </View>

              <View style={styles.formCard}>
                <View className="mb-3">
                  <Input
                    label="New Password"
                    placeholder="At least 6 characters"
                    secureTextEntry
                    secureTextEntryToggle
                    value={values.newPassword}
                    onChangeText={handleChange("newPassword")}
                    onBlur={handleBlur("newPassword")}
                    error={touched.newPassword ? errors.newPassword : undefined}
                  />
                </View>

                <View>
                  <Input
                    label="Confirm Password"
                    placeholder="Repeat new password"
                    secureTextEntry
                    secureTextEntryToggle
                    value={values.confirmPassword}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    error={
                      touched.confirmPassword
                        ? errors.confirmPassword
                        : undefined
                    }
                  />
                </View>
              </View>

              <View style={styles.guideContainer}>
                <View className="flex-row items-center mb-3">
                  <ShieldCheck size={16} color="#d1d5db" />
                  <Text className="text-gray-300 font-semibold ml-2 text-xs uppercase tracking-wider">
                    Requirements
                  </Text>
                </View>

                <View className="flex-col gap-1">
                  <RequirementItem
                    met={values.newPassword.length >= 6}
                    text="Minimum 6 characters"
                  />
                  <RequirementItem
                    met={hasUpperCase(values.newPassword)}
                    text="One Uppercase"
                  />

                  <RequirementItem
                    met={hasSpecialChar(values.newPassword)}
                    text="Special Char"
                  />
                  <RequirementItem
                    met={
                      values.newPassword.length > 0 &&
                      values.newPassword === values.confirmPassword
                    }
                    text="Passwords match"
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </FormWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: "#0f1729",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#252f47",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  guideContainer: {
    marginTop: 24,
    paddingHorizontal: 8,
  },
});
