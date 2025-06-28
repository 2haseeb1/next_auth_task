// src/app/api/ideas/[id]/route.ts
// This API route handles operations for a single idea by ID.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth.server";
import type { UpdateIdeaData } from "@/types"; // Import necessary types
import { Prisma } from "@prisma/client"; // Import Prisma namespace for enum types

// GET handler to fetch a single idea by ID
export async function GET(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: { params: any }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const id: string = params.id;
  try {
    console.log(`GET request for idea ID: ${id} at URL: ${request.url}`);
    const idea = await prisma.idea.findUnique({
      where: { id: id, userId: session.user.id },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        tags: true,
        priority: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!idea) {
      return NextResponse.json({ message: "Idea not found" }, { status: 404 });
    }
    return NextResponse.json(idea, { status: 200 });
  } catch (error) {
    console.error(`Error fetching idea ${id}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT/PATCH handler to update an idea by ID
export async function PUT(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: { params: any }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const id: string = params.id;
  try {
    const body: UpdateIdeaData = await request.json();
    console.log(`PUT request for idea ID: ${id}. Data:`, body);

    // Prepare data for Prisma update, explicitly handling optional fields and enum types
    const data: Prisma.IdeaUpdateInput = {
      // Use direct assignment for non-enum fields or if you want to explicitly update them
      title: body.title,
      description: body.description,
      tags: body.tags, // tags array is already correct

      // FIX: For enum fields, use the { set: value } structure if the value is defined.
      // This explicitly tells Prisma how to set the enum value.
      status: body.status !== undefined ? { set: body.status } : undefined,
      priority:
        body.priority !== undefined ? { set: body.priority } : undefined,

      updatedAt: new Date(),
    };

    const updatedIdea = await prisma.idea.update({
      where: { id: id, userId: session.user.id },
      data: data, // Use the prepared data
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        tags: true,
        priority: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(updatedIdea, { status: 200 });
  } catch (error) {
    console.error(`Error updating idea ${id}:`, error);
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json(
        { message: "Idea not found or not authorized" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Failed to update idea" },
      { status: 500 }
    );
  }
}

// DELETE handler to delete an idea by ID
export async function DELETE(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: { params: any }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const id: string = params.id;
  try {
    console.log(`DELETE request for idea ID: ${id}`);
    await prisma.idea.delete({
      where: { id: id, userId: session.user.id },
    });
    return NextResponse.json(
      { message: "Idea deleted successfully" },
      { status: 204 }
    );
  } catch (error) {
    console.error(`Error deleting idea ${id}:`, error);
    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return NextResponse.json(
        { message: "Idea not found or not authorized" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Failed to delete idea" },
      { status: 500 }
    );
  }
}
