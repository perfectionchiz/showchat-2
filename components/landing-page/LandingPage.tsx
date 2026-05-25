import { Button } from "@/components/common/Button";
import { GradientText } from "@/components/common/GradientText";
import Footer from "@/components/layout/Footer";
import HeroOverlays from "@/components/layout/HeroGradient";
import MockChatPreviewCard from "@/components/live/MockChatPreview";
import FeatureHighlights from "@/components/onboarding/FeatureHighlights";
import { AnimatedFans } from "@/components/ui/AnimatedFans";
import { FloatingEmojis } from "@/components/ui/FloatingEmoji";
import Logo from "@/components/ui/Logo";
import { Text } from "@/components/ui/Text";
import { shadowStyle } from "@/constants/theme";
import { TRENDING_SHOWS } from "@/utils/ambientActivity";
import { Marquee } from "@animatereactnative/marquee";
import { router } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnimatedWrapper } from "../common/AnimatedWrapper";
const Index = () => {
  return (
    <SafeAreaView edges={[]} className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className=" p-4">
          <HeroOverlays />
          <FloatingEmojis />
          <View className="mb-10 mt-20">
            <Logo style={shadowStyle} />
          </View>

          <Text variant="bold" className="text-center text-4xl text-white">
            Make TV social
          </Text>
          <GradientText textVariant="bold" className="text-4xl text-center">
            again.
          </GradientText>
          <Text
            variant="medium"
            className="mt-6 text-center text-muted-foreground text-xl"
          >
            Chat while you watch — or anytime. Join live rooms for the shows you
            love.
          </Text>
          <Button
            style={shadowStyle}
            size="lg"
            textVariant="bold"
            className="w-[200px] mx-auto mt-5"
            variant="secondary"
            onPress={() => {
              router.push("/sign-in");
            }}
          >
            🎉 Start Chatting
          </Button>
          <Button
            textVariant="bold"
            textClassName="text-xl"
            className="w-[120px] mx-auto mt-5"
            size="lg"
            variant="tertiary"
            onPress={() => router.push("/sign-in")}
          >
            Sign In
          </Button>
          <View className="mt-8 flex-row items-center">
           

            <AnimatedFans />
          </View>
          <View style={{ marginTop: 48 }}>
            <AnimatedWrapper delay={300} duration={600}>
              <MockChatPreviewCard />
            </AnimatedWrapper>
          </View>
        </View>
        <View>
          <View className="">
            <Marquee
              style={{
                backgroundColor: "#20283c33",
                paddingVertical: 14,
                paddingHorizontal: 12,
                marginTop: 60,
                borderWidth: 1,
                borderColor: "#1F293799",
                overflow: "hidden",
              }}
              spacing={40}
              speed={1}
              direction="horizontal"
            >
              <Text
                variant="medium"
                className=" text-gray-400 text-[14px] flex-row"
              >
                {TRENDING_SHOWS.join("     ")}
              </Text>
            </Marquee>
            <View>
              <Text
                variant="semibold"
                className="text-center mt-24 text-white text-4xl"
              >
                How it works
              </Text>
              <FeatureHighlights />
            </View>
          </View>
          <Footer />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
