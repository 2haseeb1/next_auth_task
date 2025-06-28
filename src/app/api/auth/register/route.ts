// src/app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Your Prisma client instance
import bcrypt from "bcryptjs"; // For password hashing
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Import types for incoming registration data and the User model
import type { RegisterData } from "@/types/auth"; // Assuming you'll define this type
import type { User } from "@/types/index"; // The User type from your index.d.ts

/**
 * POST /api/auth/register
 * Handles user registration.
 */
export async function POST(request: NextRequest) {
  try {
    const { userName, email, password, bio, roles }: RegisterData =
      await request.json();

    // Basic validation
    if (!userName || !email || !password) {
      return NextResponse.json(
        { message: "User name, email, and password are required." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Default roles if not provided, or ensure it's an array
    const userRoles =
      Array.isArray(roles) && roles.length > 0 ? roles : ["USER"];
    const userBio = bio !== undefined ? bio : null; // Handle optional bio

    try {
      // Create the user in the database
      const newUser = await prisma.user.create({
        data: {
          userName,
          email,
          password: hashedPassword, // Store the hashed password
          bio: userBio,
          roles: userRoles, // Assign roles
        },
        select: {
          // Select fields to return, NEVER include password here
          id: true,
          userName: true,
          email: true,
          roles: true,
          bio: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Construct a response object that conforms to your User type
      const responseUser: User = {
        id: newUser.id,
        userName: newUser.userName,
        email: newUser.email,
        roles: newUser.roles,
        bio: newUser.bio,
        createdAt: newUser.createdAt.toISOString(),
        updatedAt: newUser.updatedAt.toISOString(),
      };

      return NextResponse.json(responseUser, { status: 201 }); // 201 Created
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        // P2002 is the error code for unique constraint violation
        if (error.code === "P2002") {
          return NextResponse.json(
            { message: "Email already exists." },
            { status: 409 }
          ); // 409 Conflict
        }
      }
      console.error("Registration error:", error);
      return NextResponse.json(
        { message: "Failed to register user." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Request parsing error during registration:", error);
    return NextResponse.json(
      { message: "Invalid request data." },
      { status: 400 }
    );
  }
}
