import { Button } from "@/components/common/Button";
import FormWrapper from "@/components/forms/FormWrapper";
import { useUpdateProfile } from "@/hooks/profile/useProfile";
import { Save } from "lucide-react-native";
import { View } from "react-native";

import ProfileFormSection from "@/components/profile/EditProfileForm";
import ProfileAvatarSection from "@/components/profile/ProfileAvatarSection";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";
import { PRIMARY_COLOR } from "@/constants/constants";
import { useGetGenres } from "@/hooks/onboarding/useOnboarding";
import { useCheckUsername } from "@/hooks/profile/useCheckUsername";
import { ProfileForm } from "@/hooks/profile/useGetUserProfile";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { FormikProps } from "formik";
import { useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";

const ProfileSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  display_name: Yup.string(),
  bio: Yup.string(),
  favourite_genres: Yup.array().of(Yup.string()),
});

export default function EditProfile() {
  const { profile, updateProfile, isUpdating } = useUpdateProfile();
  const { data: genresData, isLoading } = useGetGenres();
  const formikRef = useRef<FormikProps<any>>(null);
  const [usernameToCheck, setUsernameToCheck] = useState<string>("");
  const {
    data,
    isLoading: isLoadingUsername,
    isError,
  } = useCheckUsername(usernameToCheck);

  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isSubOpen, setIsSubOpen] = useState(false);
  const pickImage = async (
    setFieldValue: (field: string, value: any) => void,
  ) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setFieldValue("avatar_url", asset.uri);

      setSelectedFile({
        uri: asset.uri,
        name: asset.fileName || `avatar-${Date.now()}.jpg`,
        type: asset.mimeType || "image/jpeg",
      });
    }
  };

  const genresList =
    genresData?.genres?.map((genre) => ({
      id: genre.id,
      label: genre.name,
    })) ?? [];
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-background">
      <SettingsHeader
        extraChild={
          <Button
            icon={<Save size={20} color={PRIMARY_COLOR} />}
            variant="ghost"
            isLoading={isUpdating}
            textStyles={{ color: PRIMARY_COLOR }}
            disabled={isUpdating || isLoadingUsername}
            onPress={() => formikRef?.current?.handleSubmit()}
          >
            Save
          </Button>
        }
        back={() => router.back()}
      >
        Edit Profile
      </SettingsHeader>
      <FormWrapper<ProfileForm>
        initialValues={{
          username: profile?.username || "",
          display_name: profile?.display_name || "",
          bio: profile?.bio || "",
          name: profile?.name || "",
          favourite_genres: profile?.favourite_genres || [],
          notify: profile?.notify || false,
          avatar_url: profile?.avatar_url ?? undefined,
          role: profile?.role || "",
        }}
        validationSchema={ProfileSchema}
        onSubmit={async (values) => {
          const changedValues = Object.fromEntries(
            Object.entries(values).filter(([key, value]) => {
              return (
                JSON.stringify(value) !==
                JSON.stringify((profile as any)?.[key])
              );
            }),
          );

          await updateProfile(changedValues, selectedFile);
        }}
        ref={formikRef}
      >
        {({
          values,
          handleChange,
          handleBlur,
          errors,
          touched,
          setFieldValue,
          setFieldError,
        }) => (
          <View className="flex-1 mt-6">
            <View className="px-4">
              <ProfileAvatarSection
                values={values}
                profile={profile}
                setFieldValue={setFieldValue}
                pickImage={pickImage}
                setIsSubOpen={setIsSubOpen}
              />

              <ProfileFormSection
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                setFieldError={setFieldError}
                isLoadingUsername={isLoadingUsername}
                isError={isError}
                setUsernameToCheck={setUsernameToCheck}
                data={data}
                genresList={genresList}
                isLoading={isLoading}
              />
            </View>
            <SubscriptionPlans open={isSubOpen} setOPen={setIsSubOpen} />
          </View>
        )}
      </FormWrapper>
    </View>
  );
}
