import dotenv from "dotenv";

// In local/dev, prefer .env.local, then fall back to .env
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.local" });
  dotenv.config(); // also load .env if present
} else {
  // In production, you can still use .env, but usually rely on real env vars
  dotenv.config();
}
