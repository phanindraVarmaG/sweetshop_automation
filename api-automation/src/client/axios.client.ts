import axios, { AxiosInstance, AxiosResponse } from "axios";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

/**
 * Creates a plain (unauthenticated) axios instance.
 */
export function createClient(): AxiosInstance {
  return axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    validateStatus: () => true, // Never throw — let tests assert status codes
  });
}

/**
 * Creates an authenticated axios instance with the given Bearer token.
 */
export function createAuthClient(token: string): AxiosInstance {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    validateStatus: () => true,
  });
}

export type { AxiosResponse };
