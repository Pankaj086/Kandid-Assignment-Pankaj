import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    user: process.env.PGUSER || "postgres",
    host: process.env.PGHOST || "localhost",
    database: process.env.PGDATABASE || "mydb",
    password: process.env.PGPASSWORD || "password",
    port: Number(process.env.PGPORT) || 5432,
    ssl: { rejectUnauthorized: false },
  },
});
