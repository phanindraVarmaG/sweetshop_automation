import * as dotenv from "dotenv";
import * as path from "path";
import { createClient } from "../client/axios.client";
import type { LoginResponse } from "../types";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

let cachedToken: string | null = null;

/**
 * Returns a valid Bearer token for the admin user.
 * Caches the token in-process so each test suite only calls login once.
 */
export async function getAdminToken(): Promise<string> {
  if (cachedToken) return cachedToken;

  const client = createClient();
  const res = await client.post<LoginResponse>("/auth/login", {
    email: process.env.ADMIN_EMAIL ?? "admin@shopeasy.com",
    password: process.env.ADMIN_PASSWORD ?? "password123",
  });

  if (res.status !== 200 || !res.data.token) {
    throw new Error(
      `Auth setup failed: HTTP ${res.status} — ${JSON.stringify(res.data)}`
    );
  }

  cachedToken = res.data.token;
  return cachedToken;
}

/** Clears the cached token (useful between test runs that test auth itself). */
export function clearTokenCache(): void {
  cachedToken = null;
}
