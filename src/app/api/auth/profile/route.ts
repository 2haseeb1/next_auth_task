// src/app/api/auth/profile/route.ts
// This API route handles fetching and updating the profile of the authenticated user.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth.server";

export async function GET(
  request: NextRequest // FIX: Removed 'context' parameter as it's not needed for a non-dynamic route
) {
  // Get the current session to identify the user
  const session = await auth();

  // If no session or no user in session, return unauthorized
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Explicitly using 'request.url' to satisfy potential linting for 'request'
    console.log(`GET request to ${request.url} for user profile.`);

    // Fetch the user's profile from the database using the authenticated user's ID
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        email: true,
        userName: true,
        bio: true,
        roles: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest // FIX: Removed 'context' parameter as it's not needed for a non-dynamic route
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // No context.params to log here, just logging the request method
    console.log(`PATCH request for user profile.`);

    const body = await request.json();
    const { userName, bio, roles } = body;

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        userName,
        bio,
        roles,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        userName: true,
        bio: true,
        roles: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
