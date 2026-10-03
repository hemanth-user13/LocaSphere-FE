import { CURRENT_USER_ID } from "@/data/mockData";
import type { User } from "@/types/models";

import { apiClient, ApiError } from "./api/client";
import { endpoints } from "./api/endpoints";
import { config } from "./config";
import { mockDelay } from "./mock";
import { mockDb } from "./mockDb";

export type Session = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export interface AuthService {
  /** Sends an OTP to an E.164 phone number (e.g. +919876543210). */
  requestOtp(phone: string): Promise<{ resendAfterSeconds: number }>;
  verifyOtp(phone: string, code: string): Promise<Session>;
  signInWithGoogle(idToken?: string): Promise<Session>;
  signOut(): Promise<void>;
}

const mockSession = (): Session => ({
  user: mockDb.users.find((u) => u.id === CURRENT_USER_ID)!,
  accessToken: "mock-access-token",
  refreshToken: "mock-refresh-token",
});

const mockAuthService: AuthService = {
  requestOtp: () => mockDelay({ resendAfterSeconds: 30 }),
  async verifyOtp(_phone, code) {
    // Demo rule: any 6-digit code works except 000000, which shows the error state.
    if (code === "000000") {
      await mockDelay(null);
      throw new ApiError("That code doesn't match. Please check and try again.", 400);
    }
    return mockDelay(mockSession());
  },
  signInWithGoogle: () => mockDelay(mockSession()),
  signOut: () => mockDelay(undefined),
};

const httpAuthService: AuthService = {
  requestOtp: (phone) => apiClient.post(endpoints.auth.requestOtp, { phone }),
  verifyOtp: (phone, code) => apiClient.post<Session>(endpoints.auth.verifyOtp, { phone, code }),
  signInWithGoogle: (idToken) => apiClient.post<Session>(endpoints.auth.google, { idToken }),
  signOut: async () => {
    await apiClient.post(endpoints.auth.logout);
  },
};

export const authService: AuthService = config.useMocks ? mockAuthService : httpAuthService;
