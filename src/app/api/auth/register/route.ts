
// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { serverSetAuthSession } from "@/lib/auth.server";
import type { RegisterData, AuthResponse } from "@/types/auth"; // Import RegisterData type

export async function POST(request: NextRequest) {
  try {
    const { userName, email, password, bio, roles }: RegisterData = await request.json(); // Destructure bio and roles

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        userName: userName || email.split('@')[0], // Default userName if not provided
        bio: bio || null, // Include bio if provided, else null
        roles: roles || ['user'], // Default role to 'user' if not provided
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // In a real application, you would generate a JWT token here
    // For now, we'll use a dummy token and set a mock session
    const dummyToken = `dummy-jwt-for-${newUser.id}`;
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token expires in 24 hours

    await serverSetAuthSession(dummyToken, expires);

    // Return a response that matches AuthResponse
    const authResponse: AuthResponse = {
      message: "Registration successful",
      user: {
        id: newUser.id,
        name: newUser.userName || newUser.email, // Use userName or email as display name
        email: newUser.email,
      },
      token: dummyToken,
      expires: expires.toISOString(),
    };

    return NextResponse.json(authResponse, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "An unknown error occurred during registration" }, { status: 500 });
  }
}
