// For React, import from better-auth/react
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // baseURL: process.env.NEXT_PUBLIC_APP_URL
  baseURL: "http://localhost:3000"
});

// Optionally re-export helpers
export const { signIn, signOut, useSession } = authClient;
