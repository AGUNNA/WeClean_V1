import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const dbFile = process.env.DATABASE_URL || "./data/weclean.db";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: dbFile,
  },
});
