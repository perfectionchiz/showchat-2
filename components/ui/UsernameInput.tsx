import { UsernameAvailabilityResponse } from "@/models/profile.model";
import { FormikTouched } from "formik";
import { AlertCircle, CheckCircle2 } from "lucide-react-native";
import { useRef } from "react";
import { ActivityIndicator, View } from "react-native";
import { Button } from "../common/Button";
import { Input } from "../forms/Input";
import { Text } from "./Text";

interface UsernameInputProps {
  values: { username: string };
  handleBlur: any;
  touched: FormikTouched<{ username: string }>;
  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, message?: string) => void;
  data: UsernameAvailabilityResponse | undefined;
  isError: boolean;
  isLoadingUsername: boolean;
  setUsernameToCheck: (usernameToCheck: string) => void;
}

export default function UsernameInput({
  values,
  handleBlur,
  data,
  isError,
  isLoadingUsername,
  setFieldValue,
  setFieldError,
  setUsernameToCheck,
}: UsernameInputProps) {
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleUsernameChange = (text: string) => {
    setFieldValue("username", text);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      const trimmed = text.trim();
      setUsernameToCheck(trimmed.length >= 3 ? trimmed : "");
    }, 500);
  };

  const showUsernameError =
    data && !data.available && values.username.trim().length > 0;

  const handleSuggestionClick = (rec: string) => {
    setFieldValue("username", rec);
    setUsernameToCheck(rec);
    setFieldError("username", undefined);
  };

  const hasRecommendations = !!(
    data &&
    !data.available &&
    data.recommendations?.length
  );

  const isAvailable =
    !!data && data.available && values.username.trim().length > 0;

  return (
    <View>
      <Input
        autoCapitalize="none"
        value={values.username}
        label="Username"
        inputClassName="flex-1"
        onChangeText={handleUsernameChange}
        onBlur={handleBlur("username")}
        rightIcon={
          isLoadingUsername ? (
            <ActivityIndicator size={16} color="#888" />
          ) : data ? (
            data.available ? (
              <CheckCircle2 size={16} color="#22c55e" />
            ) : (
              <AlertCircle size={16} color="#ef4444" />
            )
          ) : undefined
        }
      />

      {showUsernameError && (
        <View className="mt-2">
          <Text className="text-red-500 text-sm">
            {data?.message || "This username is already taken"}
          </Text>
        </View>
      )}

      {hasRecommendations && (
        <View className="mt-3">
          <Text className="text-xs text-muted-foreground mb-2">
            Suggestions:
          </Text>
          <View className="flex-row flex-wrap gap-2.5">
            {data!.recommendations!.map((rec: string) => (
              <Button
                key={rec}
                size="sm"
                variant="outline"
                isLoading={false}
                onPress={() => handleSuggestionClick(rec)}
                className="
                  border border-gray-700
                  bg-zinc-900
                  active:bg-zinc-800
                  rounded-full
                  px-5 py-2
                  min-h-[38px]
                "
                textClassName="text-sm font-medium text-foreground"
              >
                {rec}
              </Button>
            ))}
          </View>
        </View>
      )}

      {isAvailable && (
        <View className="mt-2">
          <Text className="text-green-500 text-sm font-medium">
            ✓ Username is available
          </Text>
        </View>
      )}

      {isError && (
        <View className="mt-2">
          <Text className="text-red-500 text-sm">
            Something went wrong. Please try again.
          </Text>
        </View>
      )}
    </View>
  );
}
