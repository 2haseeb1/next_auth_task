// src/types/auth.ts
// This file contains authentication-related types.

import type { User } from "@/types"; // Import User from the consolidated types file (index.ts)

export interface Session {
  user?: User; // Using the User type from '@/types'
  expires: string; // ISO string format
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  userName?: string;
}

export interface AuthResponse {
  message: string;
  user: {
    // This defines the shape of the user object returned by your API on login/register
    id: string;
    name: string; // This is the user's display name
    email: string;
  };
  token: string;
  expires: string; // ISO string of expiration date
}

export interface AuthError {
  message: string;
  code?: string;
}
