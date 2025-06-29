// src/lib/auth.client.ts
// This file contains client-only authentication logic.
// It uses browser APIs like 'document.cookie'.

import type { Session } from "@/types/auth"; // Import Session type from the shared types file
import type { User } from "@/types"; // Added explicit import for User type to ensure correct mocking

// --- GLOBAL CONSTANT FOR COOKIE NAME ---
const TOKEN_COOKIE_NAME = "auth_token";

/**
 * Sets an authentication token in a cookie on the client-side.
 * This function is designed to run in the browser environment.
 */
export function clientSetAuthSession(token: string, expires: Date): void {
  document.cookie = `${TOKEN_COOKIE_NAME}=${token}; expires=${expires.toUTCString()}; path=/; Secure; SameSite=Lax`;
  console.log("Mock: Auth session token set in cookie (client-side).");
}

/**
 * Retrieves the authentication token from a cookie on the client-side.
 * This function is designed to run in the browser environment.
 */
export function clientGetAuthToken(): string | null {
  const name = TOKEN_COOKIE_NAME + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

/**
 * Clears the authentication token from a cookie on the client-side.
 * This function is designed to run in the browser environment.
 */
export function clientClearAuthSession(): void {
  document.cookie = `${TOKEN_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  console.log("Mock: Auth session token cleared from cookie (client-side).");
}

/**
 * A mock function to get user session details for client-side.
 * In a real application, this would typically decode a JWT from the token
 * (which would be stored in the cookie), or make a fetch call to a backend API
 * to validate the session and get user details.
 */
export async function clientGetUserSession(): Promise<Session | null> {
  const token = clientGetAuthToken();
  if (token) {
    // FIX: Changed mockUser.id to match Alice's ID from your seed.ts
    // This ensures that when you're "logged in" with the mock user,
    // your app queries for data that actually exists for Alice.
    const mockUser: User = {
      id: "e66123d4-dc1b-45fd-8254-c3811c6caf66", // <<<--- CHANGED THIS ID
      userName: "Alice Smith", // Changed to match Alice
      email: "alice@example.com", // Changed to match Alice
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: ["admin", "user"], // Roles to match Alice
      bio: "Mock client user bio for Alice.",
    };
    return {
      user: mockUser,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }
  return null;
}
