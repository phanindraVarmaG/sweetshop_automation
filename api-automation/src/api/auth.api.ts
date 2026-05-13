import { createClient } from "../client/axios.client";
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../types";
import type { AxiosResponse } from "../client/axios.client";

const client = createClient();

export const AuthApi = {
  login(payload: LoginRequest): Promise<AxiosResponse<LoginResponse>> {
    return client.post<LoginResponse>("/auth/login", payload);
  },

  register(payload: RegisterRequest): Promise<AxiosResponse<RegisterResponse>> {
    return client.post<RegisterResponse>("/auth/register", payload);
  },
};
