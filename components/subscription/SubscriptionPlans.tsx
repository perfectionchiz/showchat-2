import { useBuyPlan } from "@/hooks/payment/useBuyPlan";
import { useGetPlans } from "@/hooks/payment/useGetPlans";
import { useGetSubscription } from "@/hooks/subscription/useGetSubscription";
import { useRestorePurchases } from "@/hooks/subscription/useRestorePurchases";
import { Plan } from "@/models/payment.model";
import { useMemo } from "react";
import { Platform } from "react-native";
import { BaseModal } from "../ui/BaseModal";
import { SubscriptionContent } from "./SubScriptionContent";

interface SubscriptionProps {
  open: boolean;
  setOPen: (open: boolean) => void;
}

export function SubscriptionPlans({ open, setOPen }: SubscriptionProps) {
  const { plans } = useGetPlans();
  const { subscription } = useGetSubscription(open);
  const currentPlanId = subscription?.plan_id;
  const isSubscribed = !!subscription && subscription.status === "active";
  const { mutate: buyPlan, isPending: isBuying } = useBuyPlan();
  const { mutate: restorePurchases, isPending: isRestoring } =
    useRestorePurchases();

  const handlePay = (plan: Plan) => {
    buyPlan(plan);
  };

  const handleRestore = () => {
    restorePurchases({
      store: Platform.OS === "ios" ? "apple" : "google",
      receipt_data: "",
    });
  };
  const filteredPlans = useMemo(() => {
    const store = Platform.OS === "ios" ? "apple" : "google";
    return plans.filter((plan) => plan.store === store);
  }, [plans]);
  return (
    <BaseModal
      isOpen={open}
      onClose={() => {
        setOPen(false);
      }}
      snapPoints={["95%"]}
    >
      <SubscriptionContent
        isBuying={isBuying}
        filteredPlans={filteredPlans}
        handlePay={handlePay}
        handleRestore={handleRestore}
        isRestoring={isRestoring}
        currentPlanId={currentPlanId}
        isSubscribed={isSubscribed}
      />
    </BaseModal>
  );
}
