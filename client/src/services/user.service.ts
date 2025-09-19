import { api } from "@/lib/axios";
import type { ApiResponse } from "shared";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface UsersResponse extends ApiResponse {
  data: User[];
}

export const userService = {
  async getUsers(): Promise<UsersResponse> {
    const response = await api.get<UsersResponse>("/users");
    return response.data;
  },
};

export default userService;