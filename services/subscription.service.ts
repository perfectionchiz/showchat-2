import { http } from "@/lib/httpHelper";
import {
    GetSubscriptionResponse,
    RestorePurchaseRequest,
    Subscription,
    VerifyReceiptRequest,
} from "@/models/payment.model";

export const subscriptionService = {
  getSubscription: async (): Promise<Subscription | null> => {
    const res = await http.get<GetSubscriptionResponse>("/subscription-list");
    return res.data.subscription;
  },

  verifyReceipt: (data: VerifyReceiptRequest) => {
    return http.post("/subscription-verify-receipt", data);
  },

  restorePurchases: async (
    data: RestorePurchaseRequest,
  ): Promise<Subscription> => {
    const res = await http.post<GetSubscriptionResponse>(
      "/subscription-restore-purchases",
      data,
    );
    return res.data.subscription;
  },
};
