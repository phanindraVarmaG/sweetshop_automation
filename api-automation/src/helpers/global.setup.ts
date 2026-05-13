import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

/**
 * Jest globalSetup — runs once before all test suites.
 * Creates output directories and validates env vars.
 */
export default async function globalSetup(): Promise<void> {
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });

  const dirs = [
    path.resolve(__dirname, "../../reports"),
    path.resolve(__dirname, "../../coverage"),
    path.resolve(__dirname, "../../artifacts"),
    path.resolve(__dirname, "../../artifacts/logs"),
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const required = ["BASE_URL", "ADMIN_EMAIL", "ADMIN_PASSWORD"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required env vars: ${missing.join(", ")}. Copy .env.example to .env and fill in values.`
    );
  }

  console.log(`\n[Setup] API target: ${process.env.BASE_URL}`);
  console.log("[Setup] Output dirs created.");
}
