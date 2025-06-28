// src/types/auth.ts
// This file contains authentication-related types.

import type { User } from "@/types"; // This import should now correctly resolve to src/types/index.ts

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
    // The user object returned by the API
    id: string;
    name: string;
    email: string;
  };
  token: string;
  expires: string; // ISO string of expiration date
}

export interface AuthError {
  message: string;
  code?: string;
}
