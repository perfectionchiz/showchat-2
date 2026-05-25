export type StoreType = "apple" | "google";

export interface PaymentParams {
  amount: number;
  currency?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
}

export interface Plan {
  id: string;
  name: string;
  plan_code: string;
  store: StoreType;
  store_product_id: string;
  interval: string;
  price_usd: number;
  features: string[];
}

export interface GetPlansResponse {
  message: string;
  data: {
    plans: Plan[];
  };
}

export interface SubscriptionPlan extends Plan {
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  store: StoreType;
  store_product_id: string;
  store_transaction_id: string;
  store_original_transaction_id: string;
  status: "active" | "expired" | "cancelled";
  started_at: string;
  expires_at: string;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  plans: SubscriptionPlan;
}

export interface GetSubscriptionResponse {
  message: string;
  data: {
    subscription: Subscription;
  };
}

export interface VerifyReceiptRequest {
  store: StoreType;
  receipt_data: string;
}

export interface RestorePurchaseRequest {
  store: StoreType;
  receipt_data: string;
}
