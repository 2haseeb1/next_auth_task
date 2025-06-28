// src/app/api/ideas/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth.server";
// FIX: Removed 'IdeaStatus' and 'Idea' from import as they are not directly used in this file's logic
// import type { IdeaStatus, Idea } from '@/types';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, status, tags, priority } = await request.json();

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
        user: { connect: { id: session.user.id } },
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

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
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
