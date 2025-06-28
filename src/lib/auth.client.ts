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
  // <<<--- ENSURE 'export' IS HERE
  // Directly manipulate `document.cookie` on the client-side.
  document.cookie = `${TOKEN_COOKIE_NAME}=${token}; expires=${expires.toUTCString()}; path=/; Secure; SameSite=Lax`;
  console.log("Mock: Auth session token set in cookie (client-side).");
}

/**
 * Retrieves the authentication token from a cookie on the client-side.
 * This function is designed to run in the browser environment.
 */
export function clientGetAuthToken(): string | null {
  // <<<--- ENSURE 'export' IS HERE
  // Parse `document.cookie` to find the token.
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
  // <<<--- ENSURE 'export' IS HERE
  // Set cookie expiration to a past date to effectively delete it.
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
  // <<<--- ENSURE 'export' IS HERE
  const token = clientGetAuthToken();
  if (token) {
    // Return a User object that EXACTLY matches the User interface from '@/types'.
    const mockUser: User = {
      id: "mock-client-user-id",
      userName: "Client User",
      email: "client@example.com",
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: ["user"],
      bio: "Mock client user bio.",
    };
    return {
      user: mockUser,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }
  return null;
}
