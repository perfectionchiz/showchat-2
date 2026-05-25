import { http } from "@/lib/httpHelper";
import {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  LogoutReQuest,
  ResetPasswordRequest,
  ResponseData,
  SignUpRequest,
  SignUpResponse,
} from "@/models/auth.model";

export const authService = {
  login: (data: LoginRequest) => {
    return http.post<LoginResponse>("/auth-login", data);
  },

  signUp: (data: SignUpRequest) => {
    return http.post<SignUpResponse>("/auth-signup", data);
  },

  forgotPassword: (data: ForgotPasswordRequest) => {
    return http.post<ResponseData>("/auth-password-reset", data);
  },

  resetPassword: (data: ResetPasswordRequest) => {
    return http.post<ResponseData>("/auth-update-password", data);
  },

  logout: (data: LogoutReQuest) => {
    return http.post<ResponseData>("/auth-logout", data);
  },
};
