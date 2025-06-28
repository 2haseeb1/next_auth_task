// src/app/api/profile/route.ts
import { NextResponse } from "next/server"; // Removed NextRequest from here
import { authMiddleware, AuthenticatedRequest } from "@/lib/authMiddleware";
import {prisma} from "@/lib/prisma";

async function handleGetProfile(
  req: AuthenticatedRequest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: { params: { [key: string]: string | string[] } }
) {
  const userId = req.userSession?.user.id;

  if (!userId) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        userName: true,
        bio: true,
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

export const GET = authMiddleware(handleGetProfile);

// You can add other HTTP methods similarly:
/*
async function handlePostProfile(
  req: AuthenticatedRequest,
  context: { params: { [key: string]: string | string[] } }
) {
    // Logic for POST requests
    return NextResponse.json({ message: 'POST to profile' });
}
export const POST = authMiddleware(handlePostProfile);
*/
