// src/lib/authMiddleware.ts
import { NextRequest, NextResponse } from "next/server";
import { User, UserSession } from "../types/index";
import { jwtVerify } from "jose";

const AUTH_SECRET = process.env.AUTH_SECRET;

// Add 'export' here
export interface AuthenticatedRequest extends NextRequest {
  userSession?: UserSession;
}

type MiddlewareHandler = (
  req: AuthenticatedRequest,
  context: { params: { [key: string]: string | string[] } }
) => Promise<NextResponse>;

export const authMiddleware = (handler: MiddlewareHandler) => {
  return async (
    req: AuthenticatedRequest,
    context: { params: { [key: string]: string | string[] } }
  ) => {
    let userSession: UserSession | null = null;

    try {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);

        if (!AUTH_SECRET) {
          console.error(
            "AUTH_SECRET is not defined. JWT verification cannot proceed."
          );
          return NextResponse.json(
            { message: "Server configuration error" },
            { status: 500 }
          );
        }

        try {
          const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(AUTH_SECRET)
          );

          const simulatedUser: User = {
              id: payload.userId as string,
              email: payload.email as string,
              userName: payload.userName as string,
              createdAt: new Date(payload.createdAt as string).toISOString(),
              updatedAt: new Date(payload.updatedAt as string).toISOString(),
              roles: [],
              bio: null
          };
          // Note: If your JWT payload doesn't contain all User fields,
          // you might need to fetch the full user from the database here.
          userSession = { token: token, user: simulatedUser };
        } catch (jwtError) {
          console.error("JWT verification failed:", jwtError);
          return NextResponse.json(
            { message: "Invalid or expired token" },
            { status: 401 }
          );
        }
      }

      if (!userSession || !userSession.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      req.userSession = userSession;
    } catch (error) {
      console.error(
        "An unexpected error occurred during authentication:",
        error
      );
      return NextResponse.json(
        { message: "Internal Server Error during auth" },
        { status: 500 }
      );
    }

    return handler(req, context);
  };
};
