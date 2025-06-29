// src/lib/auth.server.ts
// This file contains server-only authentication logic.
// It can safely import 'next/headers'.

import { cookies } from "next/headers"; // Server-only import
import type { Session } from "@/types/auth"; // Import Session type from shared types file
import type { User } from "@/types"; // Added explicit import for User type to ensure correct mocking

// --- CONFIGURATION / MOCK DATA ---
// FIX: Set DUMMY_USER_ID to match Alice's ID from your seed.ts
const DUMMY_USER_ID = "e66123d4-dc1b-45fd-8254-c3811c6caf66"; // <<<--- CHANGED TO ALICE'S ID
const TOKEN_COOKIE_NAME = "auth_token";

/**
 * Mock `auth` function for server components / API routes.
 * Returns a dummy session based on a hardcoded user ID.
 * This should only be called in server environments.
 */
export async function auth(): Promise<Session | null> {
  if (DUMMY_USER_ID) {
    // Return a User object that EXACTLY matches the definition in src/types/index.ts
    // Provide dummy values for all required User properties.
    const mockUser: User = {
      id: DUMMY_USER_ID,
      userName: "Alice Smith", // Keep consistent with Alice's details
      email: "alice@example.com", // Keep consistent with Alice's details
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: ["admin", "user"], // Keep consistent with Alice's details
      bio: "A default bio for Alice.",
    };

    return {
      user: mockUser,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }
  return null;
}

/**
 * Sets an authentication token in a cookie on the server-side response.
 */
export async function serverSetAuthSession(
  token: string,
  expires: Date
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE_NAME, token, {
    expires: expires,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
  });
  console.log("Mock: Auth session token set (server-side).");
}

/**
 * Retrieves the authentication token from a cookie on the server-side request.
 */
export async function serverGetAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value || null;
}

/**
 * Clears the authentication token from a cookie on the server-side response.
 */
export async function serverClearAuthSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE_NAME);
  console.log("Mock: Auth session token cleared (server-side).");
}
