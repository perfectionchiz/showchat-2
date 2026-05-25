import { PRIMARY_COLOR } from "@/constants/constants";
import { FormikHandlers, FormikHelpers } from "formik";
import React from "react";
import { View } from "react-native";
import { Button } from "../common/Button";
import { Input } from "../forms/Input";
import { Text } from "../ui/Text";
import UsernameInput from "../ui/UsernameInput";
import SkeletonText from "../ui/skeleton/SkeletonText";

type Genre = {
  id: string;
  label: string;
};

type ProfileFormSectionProps = {
  values: any;
  errors: any;
  touched: any;
  handleChange: FormikHandlers["handleChange"];
  handleBlur: FormikHandlers["handleBlur"];
  setFieldValue: FormikHelpers<any>["setFieldValue"];
  setFieldError: FormikHelpers<any>["setFieldError"];

  isLoadingUsername: boolean;
  isError: boolean;
  setUsernameToCheck: (val: string) => void;
  data: any;

  genresList: Genre[];
  isLoading: boolean;
};

const ProfileFormSection: React.FC<ProfileFormSectionProps> = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
  setFieldError,
  isLoadingUsername,
  isError,
  setUsernameToCheck,
  data,
  genresList,
  isLoading,
}) => {
  return (
    <View className="bg-primary px-5 py-3 rounded-2xl border border-gray-800 mt-6">
      <View className="mb-8 mt-6">
        <UsernameInput
          isLoadingUsername={isLoadingUsername}
          isError={isError}
          setUsernameToCheck={setUsernameToCheck}
          values={values}
          data={data}
          handleBlur={handleBlur}
          touched={touched}
          setFieldValue={setFieldValue}
          setFieldError={setFieldError}
        />
      </View>

      <View className="mb-8">
        <Input
          autoCapitalize="none"
          value={values.display_name}
          label="Display Name (optional)"
          inputClassName="flex-1"
          onChangeText={handleChange("display_name")}
          onBlur={() => handleBlur("display_name")}
          error={touched.display_name ? errors.display_name : undefined}
        />
      </View>

      <View className="mb-6">
        <Input
          autoCapitalize="none"
          textarea
          placeholder="Tell people about yourself..."
          label="Bio (optional)"
          inputClassName="flex-1"
          value={values.bio}
          onChangeText={handleChange("bio")}
          onBlur={() => handleBlur("bio")}
          error={touched.bio ? errors.bio : undefined}
        />
      </View>

      <View className="mb-3">
        <Text variant="semibold" className="text-white text-lg mb-3">
          Favorite Genres
        </Text>

        <View className="flex-row flex-wrap gap-2">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <SkeletonText
                  key={index}
                  width={[50, 70, 90, 65, 80, 55, 100, 75][index % 8]}
                  height={20}
                />
              ))
            : genresList.map((genre) => {
                const isSelected = (values.favourite_genres ?? []).includes(
                  genre.id,
                );

                return (
                  <Button
                    key={genre.id}
                    size="sm"
                    style={{
                      backgroundColor: isSelected ? PRIMARY_COLOR : "#0f1729",
                    }}
                    textClassName="text-xs"
                    onPress={() => {
                      const updatedGenres = isSelected
                        ? (values.favourite_genres ?? []).filter(
                            (g: string) => g !== genre.id,
                          )
                        : [...(values.favourite_genres ?? []), genre.id];

                      setFieldValue("favourite_genres", updatedGenres);
                    }}
                    className={`rounded-full  ${
                      isSelected ? "transparent" : "border-gray-800 border"
                    }`}
                  >
                    {genre.label}
                  </Button>
                );
              })}
        </View>
      </View>
    </View>
  );
};

export default ProfileFormSection;
