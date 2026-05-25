import { PRIMARY_COLOR } from "@/constants/constants";
import { GenresResponse } from "@/models/onboarding.model";
import {
  ArrowRightIcon,
  Clapperboard,
  Film,
  Mic,
  Newspaper,
  Sparkles,
  Theater,
  Trophy,
  Tv,
  type LucideIcon,
} from "lucide-react-native";
import { Platform, View } from "react-native";
import { Button } from "../common/Button";
import SkeletonText from "../ui/skeleton/SkeletonText";
import { SlideUp } from "../ui/SlideUp";
import { Text } from "../ui/Text";
import { CategoryCard } from "./CategoryCard";

interface CategoryItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface CategoryData {
  completeGenre: () => void;
  setStep: (step: number) => void;
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
  data: GenresResponse | undefined;
  isLoading?: boolean;
  isPending: boolean;
  error?: string | null;
  onRetry?: () => void;
  canSkip?: boolean;
}

export default function Category({
  setStep,
  data,
  isLoading,
  onRetry,
  error,
  selectedGenres,
  setSelectedGenres,
  canSkip = false,
  isPending,
  completeGenre,
}: CategoryData) {
  const availableIcons: LucideIcon[] = [
    Theater,
    Tv,
    Mic,
    Film,
    Trophy,
    Newspaper,
    Clapperboard,
    Sparkles,
  ];

  const getGenreIcon = (genreId: string): LucideIcon => {
    const hash = genreId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return availableIcons[hash % availableIcons.length];
  };

  const categories: CategoryItem[] =
    data?.genres?.map((genre) => ({
      id: genre.id,
      label: genre.name,
      icon: getGenreIcon(genre.id),
    })) ?? [];

  const selected = selectedGenres;
  const toggleCategory = (id: string) => {
    const newSelection = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];
    setSelectedGenres(newSelection);
  };

  const SkeletonCategories = () => {
    return (
      <View className="flex-row flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <View
            key={index}
            className="w-[48%] h-[60px] rounded-xl overflow-hidden"
          >
            <SkeletonText height={60} />
          </View>
        ))}
      </View>
    );
  };

  const ErrorState = ({
    message,
    onRetry,
  }: {
    message?: string;
    onRetry?: () => void;
  }) => {
    return (
      <View className="items-center justify-center py-10">
        <Text variant="medium" className="text-lg mb-2">
          Something went wrong 😕
        </Text>

        <Text className="text-muted-foreground text-center mb-4">
          {message ?? "We couldn’t load your genres. Please try again."}
        </Text>

        {onRetry && (
          <Button
            size="sm"
            variant="secondary"
            isLoading={isLoading}
            onPress={onRetry}
          >
            Try Again
          </Button>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 pt-6">
      <Text variant="bold" className="text-3xl">
        Choose your interest
      </Text>

      <Text className="text-muted-foreground text-lg mt-3 mb-8">
        Pick your favourite genres — we&apos;ll fill your feed with shows,
        matches, and channels you&apos;ll actually care about.
      </Text>

      {isLoading ? (
        <SkeletonCategories />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : (
        <View className="flex-row flex-wrap gap-2">
          {categories.map((item) => (
            <CategoryCard
              key={item.id}
              label={item.label}
              Icon={item.icon}
              active={selected.includes(item.id)}
              onPress={() => toggleCategory(item.id)}
            />
          ))}
        </View>
      )}

      <SlideUp visible={selected.length > 0 && !isLoading}>
        <Text variant="medium" className="text-lg text-white">
          {selected.length <= 3
            ? `Great start! You’ve picked ${selected.length} — add a few more?`
            : "Nice selection — your feed is going to be 🔥"}
        </Text>
      </SlideUp>

      <View
        className={`justify-end px-6 flex-1 ${
          Platform.OS === "web" || Platform.OS === "android" ? "pb-8" : ""
        }`}
      >
        <Button
          rightIcon={<ArrowRightIcon size={20} color="#fff" />}
          onPress={completeGenre}
          size="lg"
          className="rounded-full"
          isLoading={isPending}
          style={{ backgroundColor: PRIMARY_COLOR }}
          disabled={selected.length < 3 || isLoading || !!error || isPending}
        >
          Continue
        </Button>

        {canSkip && (
          <Button
            size="lg"
            variant="ghost"
            className="mt-2"
            isLoading={false}
            disabled={isLoading || isPending}
            onPress={() => setStep(3)}
          >
            Skip anyways
          </Button>
        )}
      </View>
    </View>
  );
}
