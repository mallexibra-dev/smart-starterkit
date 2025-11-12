import { api } from "@/lib/axios";
import type { LoginInput, RegisterInput } from "shared/src/validation/auth.validation";

export type AuthPayload = {
  user: {
    id: number;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: string;
  };
  token?: string | null;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  data?: AuthPayload;
};

export async function login(input: LoginInput): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/sign-in", input);
  return data;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/sign-up", input);
  return data;
}

export async function logout(): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/sign-out");
  return data;
}

export async function getCurrentUser(): Promise<AuthResponse> {
  const { data } = await api.get<AuthResponse>("/auth/me");
  return data;
}