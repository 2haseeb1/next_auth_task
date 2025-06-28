// lib/db.ts

// This file is primarily for Next.js API Routes (server-side).
// Do NOT import this directly into client-side components.

import { PrismaClient } from "@prisma/client";

// Declare global variable to store PrismaClient instance to prevent multiple instances in development.
// This is a common pattern for Next.js.
declare global {
  var prisma: PrismaClient | undefined;
}

// Initialize PrismaClient. Use existing instance if available, otherwise create a new one.
// This helps with hot-reloading in development.
export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// In development, store the PrismaClient instance globally to prevent new instances on hot reloads.
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// Remember to install Prisma:
// npm install prisma @prisma/client
// npx prisma init
// npx prisma db pull (if you have an existing DB)
// npx prisma generate (after making schema changes)
