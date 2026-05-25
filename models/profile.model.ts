export interface UsernameAvailabilityResponse {
  success: boolean;
  status: number;
  message: string;
  available: boolean;
  recommendations?: string[];
}
