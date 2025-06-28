// src/app/api/ideas/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth.server";

export async function POST(request: NextRequest) {
  // 'request' is used by request.json()
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, status, tags, priority } = await request.json(); // Explicit use of 'request'

    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    const newIdea = await prisma.idea.create({
      data: {
        title,
        description,
        status: status || "Draft",
        tags: tags || [],
        priority: priority || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(newIdea, { status: 201 });
  } catch (error) {
    console.error("Error creating idea:", error);
    return NextResponse.json(
      { message: "Failed to create idea" },
      { status: 500 }
    );
  }
}

// You might also have a GET handler in this file to fetch all ideas
export async function GET(request: NextRequest) {
  // 'request' is used implicitly for route context, but can be made explicit
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // FIX: Acknowledge 'request' usage for the linter, e.g., by logging a property
    // You can remove this console.log in production if not truly needed
    console.log(
      `Fetching ideas for user ${session.user.id} at path: ${request.nextUrl.pathname}`
    );

    const ideas = await prisma.idea.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(ideas, { status: 200 });
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return NextResponse.json(
      { message: "Failed to fetch ideas" },
      { status: 500 }
    );
  }
}
