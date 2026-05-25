import { PRIMARY_COLOR } from "@/constants/constants";
import { Plan } from "@/models/payment.model";
import { CheckCircle2, Crown, Zap } from "lucide-react-native";
import React, { useState } from "react";
import { Platform, ScrollView, TouchableOpacity, View } from "react-native";
import { Button } from "../common/Button";
import { GradientText } from "../common/GradientText";
import { Text } from "../ui/Text";

interface SubscriptionContentProps {
  filteredPlans: Plan[];
  handlePay: (plan: Plan) => void;
  handleRestore: () => void;
  isRestoring: boolean;
  isBuying: boolean;
  isSubscribed?: boolean;
  currentPlanId?: string;
}

export function SubscriptionContent({
  filteredPlans,
  handlePay,
  handleRestore,
  isRestoring,
  isBuying,
  isSubscribed,
  currentPlanId,
}: SubscriptionContentProps) {
  const defaultPlan =
    filteredPlans.find((p) => p.interval === "annual") || filteredPlans[0];
  const [activeTab, setActiveTab] = useState("annual");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    defaultPlan?.id || null,
  );
  const displayPlans = filteredPlans.filter((p) => p.interval === activeTab);
  const selectedPlan = filteredPlans.find((p) => p.id === selectedPlanId);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const firstPlanInTab = filteredPlans.find((p) => p.interval === tab);
    if (firstPlanInTab) {
      setSelectedPlanId(firstPlanInTab.id);
    }
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-3 pb-10">
          <View className="items-center mb-8">
            <GradientText textVariant="bold" className=" text-xl mb-2">
              ShowChats
            </GradientText>
            <View
              style={{
                backgroundColor: "#8a5cf64a",
                borderColor: PRIMARY_COLOR,
              }}
              className="p-4  rounded-3xl mb-4 border border-yellow-500"
            >
              <Crown color={PRIMARY_COLOR} size={38} fill={PRIMARY_COLOR} />
            </View>
            <Text
              variant="medium"
              className="text-white text-3xl  tracking-tighter"
            >
              {isSubscribed ? "You are Pro" : "Unlock Pro"}
            </Text>

            <Text className="text-muted-foreground text-center mt-1 font-medium px-4">
              {isSubscribed
                ? "Enjoy your premium benefits and features"
                : "Premium features for the ultimate experience"}
            </Text>
          </View>

          <View className="flex-row bg-white/5 p-1.5 rounded-2xl mb-8 border border-white/10">
            {["monthly", "annual"].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => handleTabChange(tab)}
                className={`flex-1 py-3 rounded-xl items-center ${
                  activeTab === tab ? "bg-white/10" : ""
                }`}
              >
                <Text
                  className={`capitalize font-black text-[12px] tracking-widest ${
                    activeTab === tab ? "text-white" : "text-white/30"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="gap-y-4">
            {displayPlans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              const isCurrentPlan = currentPlanId === plan.id;

              return (
                <TouchableOpacity
                  key={plan.id}
                  activeOpacity={0.9}
                  style={{ borderColor: PRIMARY_COLOR }}
                  onPress={() => setSelectedPlanId(plan.id)}
                  className={`p-6 rounded-[28px] border-2 transition-all
                    bg-white/5`}
                >
                  <View className="flex-row justify-between items-start">
                    <View>
                      <View className="flex-row items-center gap-2 mb-1">
                        <Text
                          className={`text-[12px] font-black uppercase tracking-[2px] text-white`}
                        >
                          {plan.name}
                        </Text>
                        {isCurrentPlan && (
                          <View className="bg-white/10 px-2 py-0.5 rounded-md">
                            <Text className="text-[10px] text-white font-bold uppercase">
                              Current
                            </Text>
                          </View>
                        )}
                      </View>
                      <View className="flex-row items-baseline">
                        <Text className="text-white text-3xl font-black">
                          ${plan.price_usd}
                        </Text>
                        <Text className="text-muted-foreground font-bold ml-1">
                          /{plan.interval === "monthly" ? "mo" : "yr"}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        backgroundColor:
                          isSelected || isCurrentPlan
                            ? PRIMARY_COLOR
                            : "transparent",
                        borderColor:
                          isSelected || isCurrentPlan
                            ? PRIMARY_COLOR
                            : "#ffffff20",
                      }}
                      className={`w-6 h-6 rounded-full items-center justify-center border-2 `}
                    >
                      {(isSelected || isCurrentPlan) && (
                        <CheckCircle2 size={14} color="white" />
                      )}
                    </View>
                  </View>

                  <View className="mt-6 gap-y-3">
                    {plan.features?.slice(0, 3).map((feature, idx) => (
                      <View key={idx} className="flex-row items-center gap-3">
                        <View
                          style={{ backgroundColor: "#8a5cf64a" }}
                          className={`p-1 rounded-md `}
                        >
                          <Zap
                            size={10}
                            color={PRIMARY_COLOR}
                            fill={PRIMARY_COLOR}
                          />
                        </View>
                        <Text className="text-white text-xs font-bold capitalize">
                          {feature.replace(/_/g, " ")}
                        </Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text className="text-muted-foreground text-[12px] text-center mt-10 font-bold uppercase tracking-widest leading-4">
            Secured Payment. Manage via{"\n"}
            {Platform.OS === "ios" ? "App Store" : "Google Play"}
          </Text>
        </View>
      </ScrollView>

      <View className="p-6 border-t border-white/5">
        <Button
          disabled={isBuying || isSubscribed}
          isLoading={isBuying}
          textVariant="semibold"
          textClassName="uppercase text-sm"
          size="lg"
          onPress={() => selectedPlan && handlePay(selectedPlan)}
          style={{
            backgroundColor: isSubscribed ? "#ffffff10" : PRIMARY_COLOR,
          }}
          className={`py-4 rounded-2xl`}
        >
          {isSubscribed
            ? "Active Subscription"
            : selectedPlan
              ? `Get ${selectedPlan.name} Now`
              : "Select a Plan"}
        </Button>

        <View className="flex-row justify-center gap-6 mt-5">
          <TouchableOpacity disabled={isRestoring} onPress={handleRestore}>
            <Text
              variant="semibold"
              className=" text-[12px] font-black uppercase tracking-widest"
            >
              {isRestoring ? " Restoring" : " Restore"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-muted-foreground text-[12px] font-black uppercase tracking-widest">
              Terms
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
