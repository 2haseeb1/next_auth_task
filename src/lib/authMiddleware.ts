// src/lib/authMiddleware.ts
import { NextRequest, NextResponse } from "next/server";
// FIX: Removed 'Session' import as it's no longer directly used in this file
// import type { Session } from "@/types/auth";
import { jwtVerify } from "jose"; // For JWT verification

const AUTH_SECRET = process.env.AUTH_SECRET; // This should be a strong, secret key

// Define the paths that require authentication
// Adjust these to match your application's protected routes
const protectedRoutes = [
  "/profile",
  "/ideas",
  "/ideas/new",
  "/ideas/[id]",
  "/projects",
  "/projects/new",
  "/projects/[id]",
  "/tasks",
  "/tasks/new",
  "/tasks/[id]",
  // Add any API routes that require authentication
  "/api/ideas",
  "/api/ideas/[id]",
  "/api/projects",
  "/api/projects/[id]",
  "/api/tasks",
  "/api/tasks/[id]",
  "/api/auth/profile", // Your profile API route
];

// Middleware function to handle authentication and authorization
export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If the path is not a protected route, allow the request to proceed
  const isProtectedRoute = protectedRoutes.some((route) => {
    // Basic check for dynamic routes
    if (
      route.includes("[id]") ||
      route.includes("[projectId]") ||
      route.includes("[taskId]")
    ) {
      // Regex to match dynamic segments. Example: /ideas/abc-123 should match /ideas/[id]
      const regexRoute = new RegExp(
        `^${route.replace(/\[[^\]]+\]/g, "[^/]+")}$`
      );
      return regexRoute.test(pathname);
    }
    return pathname === route || pathname.startsWith(`${route}/`);
  });

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get the token from the cookie
  const token = request.cookies.get("auth_token")?.value;

  // If no token, redirect to login page
  if (!token) {
    // For API routes, return a 401 Unauthorized response
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    // For page routes, redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname); // Add callback URL
    return NextResponse.redirect(loginUrl);
  }

  // Verify the token
  if (!AUTH_SECRET) {
    console.error("AUTH_SECRET is not defined in environment variables.");
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const secret = new TextEncoder().encode(AUTH_SECRET);

  try {
    await jwtVerify(token, secret); // Just verify, no need to capture payload if not used
  } catch (error) {
    console.error("Token verification failed:", error);
    // If token verification fails, clear the cookie and redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth_token");
    return response;
  }

  // If authenticated and authorized, proceed with the request
  return NextResponse.next();
}
