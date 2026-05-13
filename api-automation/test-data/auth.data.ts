import type { LoginRequest, RegisterRequest } from "../src/types";

export const validAdmin: LoginRequest = {
  email: "admin@shopeasy.com",
  password: "password123",
};

export const validNewUser: RegisterRequest = {
  email: `qa_user_${Date.now()}@example.com`, // unique per run to avoid 409
  password: "securepass123",
  name: "QA Tester",
};

export const invalidCredentials: LoginRequest = {
  email: "wrong@example.com",
  password: "wrongpassword",
};

export const missingEmailLogin = {
  password: "password123",
};

export const missingPasswordLogin = {
  email: "admin@shopeasy.com",
};

export const missingNameRegister = {
  email: "noname@example.com",
  password: "pass1234",
};

export const missingEmailRegister = {
  name: "No Email User",
  password: "pass1234",
};

export const duplicateUser: RegisterRequest = {
  email: "admin@shopeasy.com", // already seeded
  password: "password123",
  name: "Admin Again",
};
