/**
 * Local Dev Environment Setup Script
 *
 * Usage:
 *   npm run setup:local
 *
 * Responsibilities:
 * - Ensure a local .env file exists (copied from .env.example if missing)
 * - Load env vars
 * - Run database migrations
 * - Seed demo data (if not already present)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import dotenv from "dotenv";
import { seedDemoData } from "../server/seed";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// We use .env.local for developer-specific settings
const envExamplePath = path.join(rootDir, ".env.example");
const envPath = path.join(rootDir, ".env.local");

async function main() {
  console.log("🏁 Local dev setup starting...");

  if (!fs.existsSync(envExamplePath)) {
    console.warn("⚠️  .env.example not found. Please add it before running setup.");
  }

  // Create .env.local from template if missing
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log(`✅ Created ${path.relative(rootDir, envPath)} from .env.example.`);
    console.log("   Please edit this file and set at least DATABASE_URL, SESSION_SECRET, ADMIN_EMAILS.");
  } else if (fs.existsSync(envPath)) {
    console.log(`ℹ️  Using existing ${path.relative(rootDir, envPath)}.`);
  }

  // Load env vars from .env.local if present
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log("✅ Loaded environment variables from .env.local");
  }

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set. Please update .env.local and rerun `npm run setup:local`.");
    process.exit(1);
  }

  // Run migrations
  console.log("📦 Running database migrations (drizzle-kit push)...");
  execSync("npm run db:push", { stdio: "inherit" });

  // Seed demo data (idempotent – seedDemoData checks if data already exists)
  console.log("🌱 Seeding demo data (if needed)...");
  await seedDemoData();

  console.log("\n🎉 Local dev environment is ready!");
  console.log("Next steps:");
  console.log("  1. Start the dev server:");
  console.log("       npm run dev");
  console.log("  2. Open the app at the BASE_URL you set (e.g. http://localhost:3001).");
}

main().catch((err) => {
  console.error("❌ Setup script failed:", err);
  process.exit(1);
});
