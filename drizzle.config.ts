import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/auth-schema.ts", // the Better Auth generated schema will go here
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
