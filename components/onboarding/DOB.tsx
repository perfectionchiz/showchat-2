import { PRIMARY_COLOR } from "@/constants/constants";
import { ArrowRightIcon } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  ScrollView as RNScrollView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../common/Button";
import { Text } from "../ui/Text";

interface DateOfBirthProps {
  completeOnboarding: () => void;
  onSubmitDob: (dob: { day: string; month: string; year: string }) => void;
  isLoading: boolean;
  canSkip?: boolean;
  setStep: (step: number) => void;
  initialDob?: { day: string; month: string; year: string };
}

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) =>
  (currentYear - i).toString(),
);

const getDaysInMonth = (monthIndex: number, year: number) => {
  return Array.from(
    { length: new Date(year, monthIndex + 1, 0).getDate() },
    (_, i) => (i + 1).toString().padStart(2, "0"),
  );
};

const isAdult = (day: string, month: string, year: string) => {
  const dob = new Date(`${year}-${month}-${day}`);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age >= 18;
};

export default function DateOfBirthScreen({
  completeOnboarding,
  onSubmitDob,
  isLoading,
  canSkip,
  setStep,
  initialDob,
}: DateOfBirthProps) {
  const defaultYear = (currentYear - 18).toString();
  const defaultMonth = "Jan";
  const defaultDay = "01";

  const getInitialMonth = () => {
    if (!initialDob?.month) return defaultMonth;
    if (months.includes(initialDob.month)) return initialDob.month;

    const monthNum = parseInt(initialDob.month, 10);
    if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
      return months[monthNum - 1];
    }
    return defaultMonth;
  };

  const initialMonth = getInitialMonth();
  const initialDay = initialDob?.day ?? defaultDay;
  const initialYear = initialDob?.year ?? defaultYear;

  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);

  const [availableDays, setAvailableDays] = useState(() =>
    getDaysInMonth(months.indexOf(initialMonth), Number(initialYear)),
  );

  const monthScrollRef = useRef<RNScrollView>(null);
  const dayScrollRef = useRef<RNScrollView>(null);
  const yearScrollRef = useRef<RNScrollView>(null);

  const [hasScrolledToInitial, setHasScrolledToInitial] = useState(false);

  useEffect(() => {
    const monthIndex = months.indexOf(selectedMonth);
    const days = getDaysInMonth(monthIndex, Number(selectedYear));
    setAvailableDays(days);

    if (!days.includes(selectedDay)) {
      setSelectedDay("01");
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (hasScrolledToInitial || !initialDob) return;

    const timeout = setTimeout(() => {
      if (monthScrollRef.current) {
        const monthIndex = months.indexOf(selectedMonth);
        if (monthIndex !== -1) {
          const scrollX = monthIndex * 100 - 40;
          monthScrollRef.current.scrollTo({ x: scrollX, animated: false });
        }
      }
      if (dayScrollRef.current) {
        const dayIndex = availableDays.indexOf(selectedDay);
        if (dayIndex !== -1) {
          const scrollX = dayIndex * 70 - 100;
          dayScrollRef.current.scrollTo({ x: scrollX, animated: false });
        }
      }
      if (yearScrollRef.current) {
        const yearIndex = years.indexOf(selectedYear);
        if (yearIndex !== -1) {
          const scrollX = yearIndex * 80 - 40;
          yearScrollRef.current.scrollTo({ x: scrollX, animated: false });
        }
      }

      setHasScrolledToInitial(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, [
    initialDob,
    hasScrolledToInitial,
    selectedMonth,
    selectedDay,
    selectedYear,
    availableDays,
  ]);

  useEffect(() => {
    onSubmitDob({
      day: selectedDay,
      month: selectedMonth,
      year: selectedYear,
    });
  }, [selectedDay, selectedMonth, selectedYear, onSubmitDob]);

  const adult = isAdult(
    selectedDay,
    (months.indexOf(selectedMonth) + 1).toString().padStart(2, "0"),
    selectedYear,
  );

  const age = currentYear - Number(selectedYear);

  const handleSubmit = () => {
    onSubmitDob({ day: selectedDay, month: selectedMonth, year: selectedYear });
    completeOnboarding();
  };

  return (
    <View className="flex-1">
      <View className="pt-6">
        <Text variant="bold" className="text-white text-3xl mb-3">
          What&apos;s Your Date of Birth?
        </Text>
        <Text className="text-gray-400 text-lg mb-8">
          We use this to personalize your experience and make sure content is
          age-appropriate.
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Month */}
        <Text variant="medium" className="text-gray-400 mb-2">
          Month
        </Text>
        <ScrollView
          ref={monthScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-8"
        >
          {months.map((month) => (
            <TouchableOpacity
              key={month}
              onPress={() => setSelectedMonth(month)}
              style={{
                backgroundColor:
                  selectedMonth === month ? PRIMARY_COLOR : "#111827",
              }}
              className={`mr-3 px-5 py-3 rounded-full ${selectedMonth === month ? "" : "border border-gray-700"}`}
            >
              <Text
                variant={selectedMonth === month ? "bold" : "regular"}
                className="text-white"
              >
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text variant="medium" className="text-gray-400 mb-2">
          Day
        </Text>
        <ScrollView
          ref={dayScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-8"
        >
          {availableDays.map((day) => (
            <TouchableOpacity
              key={day}
              onPress={() => setSelectedDay(day)}
              style={{
                backgroundColor:
                  selectedDay === day ? PRIMARY_COLOR : "#111827",
              }}
              className={`mr-3 w-14 h-14 items-center justify-center rounded-full ${selectedDay === day ? "" : " border border-gray-700"}`}
            >
              <Text
                variant={selectedDay === day ? "bold" : "regular"}
                className="text-white"
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text variant="medium" className="text-gray-400 mb-2">
          Year
        </Text>
        <ScrollView
          ref={yearScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-8"
        >
          {years.map((year) => (
            <TouchableOpacity
              key={year}
              onPress={() => setSelectedYear(year)}
              style={{
                backgroundColor:
                  selectedYear === year ? PRIMARY_COLOR : "#111827",
              }}
              className={`mr-4 px-5 py-3 rounded-full min-w-[70px] items-center ${selectedYear === year ? "" : " border border-gray-700"}`}
            >
              <Text
                variant={selectedYear === year ? "bold" : "regular"}
                className="text-white"
              >
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="mb-10 flex-row items-center gap-2 flex-wrap">
          <Text variant="semibold" className="text-white text-xl">
            I&apos;m {age} years old
          </Text>
          {!adult && (
            <Text
              variant="medium"
              className="font-medium text-red-500 text-base"
            >
              - You must be 18+ to continue
            </Text>
          )}
        </View>
      </ScrollView>

      <View
        className={`justify-end px-6 flex-1 ${
          Platform.OS === "web" || Platform.OS === "android" ? "pb-8" : ""
        }`}
      >
        <Button
          rightIcon={<ArrowRightIcon size={20} color="#fff" />}
          onPress={handleSubmit}
          size="lg"
          className="rounded-full"
          style={{ backgroundColor: PRIMARY_COLOR }}
          isLoading={isLoading}
          disabled={!adult || isLoading}
        >
          Continue
        </Button>

        {canSkip && (
          <Button
            size="lg"
            variant="ghost"
            className="mt-2"
            isLoading={false}
            disabled={isLoading}
            onPress={() => setStep(2)}
          >
            Skip anyways
          </Button>
        )}
      </View>
    </View>
  );
}
