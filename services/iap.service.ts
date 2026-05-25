import { useEffect } from "react";
import * as RNIap from "react-native-iap";

export const useIAPListener = (onSuccess: (receipt: any) => void) => {
  useEffect(() => {
    let purchaseUpdate: any;
    let purchaseError: any;

    const start = async () => {
      await RNIap.initConnection();

      purchaseUpdate = RNIap.purchaseUpdatedListener(async (purchase) => {
        const receipt =
          (purchase as any).transactionReceipt ||
          (purchase as any).purchaseToken ||
          purchase.transactionId;
        if (receipt) {
          onSuccess(receipt);
          await RNIap.finishTransaction({ purchase });
        }
      });

      purchaseError = RNIap.purchaseErrorListener((error) => {
        console.log("Purchase error:", error);
      });
    };

    start();

    return () => {
      purchaseUpdate?.remove();
      purchaseError?.remove();
      RNIap.endConnection();
    };
  }, []);
};
