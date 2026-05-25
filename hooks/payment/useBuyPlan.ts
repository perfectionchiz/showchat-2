import { subscriptionService } from "@/services/subscription.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Constants, { ExecutionEnvironment } from "expo-constants";

export const useBuyPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: any) => {
      if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient)
        return;

      const RNIap = await import("react-native-iap");

      await RNIap.initConnection();

      const purchase: any = await RNIap.requestPurchase(plan.store_product_id);

      const singlePurchase = Array.isArray(purchase) ? purchase[0] : purchase;

      if (!singlePurchase) {
        throw new Error("Purchase failed");
      }

      const receipt =
        singlePurchase.transactionReceipt || singlePurchase.receipt;

      if (!receipt) {
        throw new Error("Receipt not found");
      }

      const res = await subscriptionService.verifyReceipt({
        store: plan.store,
        receipt_data: receipt,
      });

      await RNIap.finishTransaction({
        purchase: singlePurchase,
        isConsumable: false,
      });

      return res;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subscription"],
      });
    },
  });
};
