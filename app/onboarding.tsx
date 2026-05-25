import { IconButton } from "@/components/common/IconButton";
import Category from "@/components/onboarding/Category";
import DateOfBirthScreen, { months } from "@/components/onboarding/DOB";
import FollowShowsScreen from "@/components/onboarding/FollowShow";
import CircleProgress from "@/components/ui/CircleProgressBar";
import Logo from "@/components/ui/Logo";
import { PRIMARY_COLOR } from "@/constants/constants";
import {
  useCompleteOnboarding,
  useGetGenres,
} from "@/hooks/onboarding/useOnboarding";
import { useAuthStore } from "@/store/authStore";
import { formatDOB } from "@/utils/formatDOB";
import { AnimatePresence, MotiView } from "moti"; //

import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Onboarding() {
  const totalSteps = 3;

  const user = useAuthStore().user;

  const [step, setStep] = useState(1);

  const [dob, setDob] = useState<{
    day: string;
    month: string;
    year: string;
  } | null>(null);

  const [userGenres, setUserGenres] = useState<string[]>([]);
  const [followedShows, setFollowedShows] = useState<string[]>([]);

  const { data, isLoading, isError, error, refetch } = useGetGenres();
  const { mutate, isPending } = useCompleteOnboarding(setStep);

  useEffect(() => {
    if (!user || user.onboarding_completed) return;

    if (user.date_of_birth) {
      const match = user.date_of_birth.match(
        /^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/,
      );

      if (match) {
        const year = match[1];
        const monthNum = parseInt(match[2], 10);
        const day = parseInt(match[3], 10);

        setDob({
          day: String(day).padStart(2, "0"),
          month: months[monthNum - 1],
          year,
        });
      }
    }

    if (user.favourite_genres) {
      setUserGenres(user.favourite_genres);
    }

    if (user.interests) {
      setFollowedShows(user.interests);
    }

    if (!user.date_of_birth) setStep(1);
    else if (!user.favourite_genres) setStep(2);
    else if (!user.interests) setStep(3);
    else setStep(3);
  }, [user]);

  useEffect(() => {
    setFollowedShows([]);
  }, [userGenres]);

  const showError = isError && !data;
  const errorMessage =
    showError && error instanceof Error ? error.message : null;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <DateOfBirthScreen
            isLoading={isPending}
            onSubmitDob={setDob}
            initialDob={dob ?? undefined}
            canSkip={!!user?.date_of_birth}
            setStep={setStep}
            completeOnboarding={() => {
              if (dob) {
                mutate({ date_of_birth: formatDOB(dob) });
              }
            }}
          />
        );

      case 2:
        return (
          <Category
            isLoading={isLoading}
            isPending={isPending}
            data={data}
            onRetry={refetch}
            error={errorMessage}
            setSelectedGenres={setUserGenres}
            selectedGenres={userGenres}
            canSkip={!!user?.favourite_genres}
            setStep={setStep}
            completeGenre={() => {
              mutate({ favourite_genres: userGenres ?? [] });
            }}
          />
        );

      case 3:
        return (
          <FollowShowsScreen
            followedShows={followedShows}
            setFollowedShows={setFollowedShows}
            userGenres={userGenres}
            isPending={isPending}
            completeShows={() => {
              mutate({ interests: followedShows ?? [] });
            }}
          />
        );

      default:
        return null;
    }
  };

  const progressPercent = (step / totalSteps) * 100;

  return (
    <SafeAreaView
      style={{
        paddingHorizontal: 12,
        paddingTop: Platform.OS === "web" ? 24 : 10,
      }}
      className="flex-1 bg-background"
    >
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-5">
          <View className="flex-row items-center">
            {step !== 1 && (
              <IconButton
                size={30}
                className="mr-2"
                onPress={() => setStep(step - 1)}
                icon={<ChevronLeft size={25} color="#fff" />}
              />
            )}

            <Logo
              iconSize={20}
              size={40}
              fontClassName="text-2xl"
              style={undefined}
            />
          </View>

          <CircleProgress
            strokeWidth={2}
            textColor="#95A3B8"
            color={PRIMARY_COLOR}
            size={30}
            textSize={14}
            progress={progressPercent}
            step={step}
          />
        </View>
        <AnimatePresence exitBeforeEnter>
          <MotiView
            key={step}
            from={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 0, translateX: -20 }}
            transition={{ type: "timing", duration: 300 }}
            className="flex-1"
            style={Platform.OS === "web" && { height: 800 }}
          >
            {renderStep()}
          </MotiView>
        </AnimatePresence>
      </View>
    </SafeAreaView>
  );
}
