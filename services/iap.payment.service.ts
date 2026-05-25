import Constants, { ExecutionEnvironment } from "expo-constants";
import * as RNIap from "react-native-iap";
import { subscriptionService } from "./subscription.service";

export const buyPlan = async (plan: any) => {
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient)
    return;

  await RNIap.initConnection();

  const purchase = await RNIap.requestPurchase(plan.store_product_id);
  const singlePurchase = Array.isArray(purchase) ? purchase[0] : purchase;

  if (!singlePurchase) {
    throw new Error("No purchase returned");
  }

  const receipt =
    (singlePurchase as any).transactionReceipt ||
    (singlePurchase as any).receipt;

  if (!receipt) {
    throw new Error("Receipt not found");
  }

  await subscriptionService.verifyReceipt({
    store: plan.store,
    receipt_data: receipt,
  });

  await RNIap.finishTransaction({
    purchase: singlePurchase,
    isConsumable: false,
  });
};
