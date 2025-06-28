// types/auth.d.ts

import { User } from "./index.d";

/**
 * Represents the structure of user data returned upon successful login.
 */
export type AuthResponse = {
  user: User;
  token: string; // JWT or session token
  expiresIn?: number; // Token expiration in seconds
};

/**
 * Represents the shape of login credentials.
 */
export type LoginCredentials = {
  email: string;
  password?: string; // Password might be optional for OAuth flows
};

/**
 * Represents the shape of registration data.
 */
export type RegisterData = {
  email: string;
  password: string;
  name?: string;
  userName: string;
   bio?: string | null; // <-- ADD THIS LINE (Optional, can be string or null)
  roles?: string[]; 
};

/**
 * Represents the current session information of the logged-in user.
 */
export interface UserSession {
  user: User; // This will hold the User object defined in index.d.ts
  token: string;
  isAuthenticated: boolean;
  // --- IMPORTANT: REMOVE 'userId' AND 'email' FROM HERE ---
  // They are already accessible via `session.user.id` and `session.user.email`.
}

/**
 * Represents potential authentication errors.
 */
export type AuthError = {
  message: string;
  code?: string;
  details?: never;
};
