// src/app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Assuming your prisma client
import bcrypt from "bcryptjs"; // For password hashing/comparison (npm install bcryptjs @types/bcryptjs)
import { serverSetAuthSession } from "@/lib/auth.server"; // <<<--- CORRECTED IMPORT

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const mockToken = `mock-token-for-${user.id}-${Date.now()}`;
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await serverSetAuthSession(mockToken, expires);

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          name: user.userName,
          email: user.email,
        },
        token: mockToken,
        expires: expires.toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
