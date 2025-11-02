import { api } from "@/lib/axios";
import type { LoginInput } from "shared/src/validation/auth.validation";

export type AuthPayload = {
  user: {
    id: number;
    name: string;
    username: string;
    email: string | null;
  };
  access_token: string;
  access_expires_at: string;
  refresh_token: string;
  refresh_expires_at: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  data?: AuthPayload;
};

export async function login(input: LoginInput): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", input);
  return data;
}