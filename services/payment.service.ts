import { http } from "@/lib/httpHelper";
import {
    CreatePaymentIntentRequest,
    CreatePaymentIntentResponse,
    Plan,
} from "@/models/payment.model";

export const paymentService = {
  createPaymentIntent: (data: CreatePaymentIntentRequest) => {
    return http.post<CreatePaymentIntentResponse>(
      "/create-payment-intent",
      data,
    );
  },
  getPlans: () => {
    return http.get<{ plans: Plan[] }>("/plan-list");
  },
};
