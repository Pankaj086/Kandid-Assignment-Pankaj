// For React, import from better-auth/react
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // baseURL is optional when server runs on same domain
  // baseURL: process.env.NEXT_PUBLIC_APP_URL
});

// Optionally re-export helpers
export const { signIn, signOut, useSession } = authClient;
