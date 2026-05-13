import { AuthApi } from "../../src/api/auth.api";
import {
  validAdmin,
  validNewUser,
  invalidCredentials,
  missingEmailLogin,
  missingPasswordLogin,
  missingNameRegister,
  missingEmailRegister,
  duplicateUser,
} from "../../test-data/auth.data";

describe("Auth API", () => {
  // ─── POST /auth/login ──────────────────────────────────────────────────────

  describe("POST /auth/login", () => {
    it("TC-AUTH-001 | should return 200 and a token for valid credentials", async () => {
      const res = await AuthApi.login(validAdmin);

      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty("token");
      expect(typeof res.data.token).toBe("string");
      expect(res.data.token.length).toBeGreaterThan(0);
      expect(res.data).toHaveProperty("userId");
      expect(typeof res.data.userId).toBe("number");
    });

    it("TC-AUTH-002 | should return 401 for invalid password", async () => {
      const res = await AuthApi.login(invalidCredentials);

      expect(res.status).toBe(401);
      expect(res.data).toHaveProperty("error");
    });

    it("TC-AUTH-003 | should return 400 when email is missing", async () => {
      const res = await AuthApi.login(missingEmailLogin as any);

      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty("error");
    });

    it("TC-AUTH-004 | should return 400 when password is missing", async () => {
      const res = await AuthApi.login(missingPasswordLogin as any);

      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty("error");
    });

    it("TC-AUTH-005 | should return 401 for empty credentials", async () => {
      const res = await AuthApi.login({ email: "", password: "" });

      expect([400, 401]).toContain(res.status);
      expect(res.data).toHaveProperty("error");
    });

    it("TC-AUTH-006 | should return 401 for correct email but wrong password", async () => {
      const res = await AuthApi.login({
        email: validAdmin.email,
        password: "totallyWrongPass!",
      });

      expect(res.status).toBe(401);
      expect(res.data).toHaveProperty("error");
    });
  });

  // ─── POST /auth/register ──────────────────────────────────────────────────

  describe("POST /auth/register", () => {
    it("TC-AUTH-007 | should return 201 and userId for a new user", async () => {
      const res = await AuthApi.register(validNewUser);

      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty("userId");
      expect(typeof res.data.userId).toBe("number");
      expect(res.data).toHaveProperty("message");
    });

    it("TC-AUTH-008 | should return 409 when email already exists", async () => {
      const res = await AuthApi.register(duplicateUser);

      expect(res.status).toBe(409);
      expect(res.data).toHaveProperty("error");
    });

    it("TC-AUTH-009 | should return 400 when name is missing", async () => {
      const res = await AuthApi.register(missingNameRegister as any);

      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty("error");
    });

    it("TC-AUTH-010 | should return 400 when email is missing", async () => {
      const res = await AuthApi.register(missingEmailRegister as any);

      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty("error");
    });

    it("TC-AUTH-011 | should return 400 when password is missing", async () => {
      const res = await AuthApi.register({
        email: "nopass@example.com",
        name: "No Pass",
      } as any);

      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty("error");
    });

    it("TC-AUTH-012 | newly registered user should be able to login", async () => {
      // Register a unique user
      const newUser = {
        email: `flow_user_${Date.now()}@example.com`,
        password: "flowpass123",
        name: "Flow User",
      };
      const registerRes = await AuthApi.register(newUser);
      expect(registerRes.status).toBe(201);

      // Login with the same credentials
      const loginRes = await AuthApi.login({
        email: newUser.email,
        password: newUser.password,
      });
      expect(loginRes.status).toBe(200);
      expect(loginRes.data).toHaveProperty("token");
    });
  });
});
