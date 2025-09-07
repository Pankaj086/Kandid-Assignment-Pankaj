import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js"; // Next.js cookie integration
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/db";
import * as authSchema from "@/db/schema/auth-schema"; 

export const auth = betterAuth({
  // Wire Drizzle + Postgres
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
    // If your tables are plural (users, sessions, accounts), uncomment:
    // usePlural: true,
    // OR pass a schema mapping if needed:
    // schema: { ...schema, user: schema.users }
  }),

  // Enable Google OAuth
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  
  emailAndPassword: { 
    enabled: true, 
  }, 

  // Next.js cookie helpers
  plugins: [nextCookies()],
});
