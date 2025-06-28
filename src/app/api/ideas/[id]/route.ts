// src/app/api/ideas/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"; // Import Prisma's error type
import { prisma } from "@/lib/prisma"; // Ensure your Prisma client is imported correctly
import type { UpdateIdeaData, Idea } from "@/types/index"; // Import necessary types, including Idea for partial updates

// Define the common props interface for all handler functions in this dynamic route
interface RouteHandlerProps {
  params: {
    id: string; // The dynamic segment [id] will be a string
  };
}

/**
 * GET /api/ideas/[id]
 * Fetches a single idea by its ID.
 * This is a Server-Side API route.
 */
export async function GET(
  request: NextRequest,
  props: RouteHandlerProps // Accept the full props object containing params
) {
  // CRUCIAL FIX: Explicitly await `props.params` because Turbopack (or Next.js 15.x)
  // might wrap `params` in a Promise-like object, causing direct access errors.
  const { id } = await Promise.resolve(props.params);

  // Validate if the ID is provided in the URL
  if (!id) {
    console.error("GET /api/ideas/[id]: Idea ID is missing in request params.");
    return NextResponse.json(
      { message: "Idea ID is required" },
      { status: 400 }
    );
  }

  try {
    // Attempt to find the unique idea in the database by its ID
    const idea = await prisma.idea.findUnique({
      where: {
        id: id,
      },
      // Optional: If you need to include related data (e.g., the user who created it)
      // include: {
      //   user: {
      //     select: { userName: true, email: true } // Select specific fields from the related User
      //   },
      //   convertedToProject: {
      //     select: { id: true, name: true } // If an idea can be linked to a project
      //   }
      // }
    });

    // If no idea is found with the given ID, return a 404 Not Found response
    if (!idea) {
      console.warn(`GET /api/ideas/[id]: Idea with ID ${id} not found.`);
      return NextResponse.json({ message: "Idea not found" }, { status: 404 });
    }

    // Return the found idea with a 200 OK status
    return NextResponse.json(idea, { status: 200 });
  } catch (error) {
    // Log the error for server-side debugging
    console.error(
      `API Error (GET /api/ideas/${id}): Could not fetch idea:`,
      error
    );
    // Return a generic internal server error response to the client
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/ideas/[id]
 * Updates an existing idea by its ID with the provided data.
 * This is a Server-Side API route.
 */
export async function PUT( // Or PATCH, depending on whether you expect full replacement or partial updates
  request: NextRequest,
  props: RouteHandlerProps // Accept the full props object containing params
) {
  // CRUCIAL FIX: Explicitly await `props.params` for Turbopack compatibility.
  const { id } = await Promise.resolve(props.params);

  // Validate if the ID is provided in the URL
  if (!id) {
    console.error("PUT /api/ideas/[id]: Idea ID is missing in request params.");
    return NextResponse.json(
      { message: "Idea ID is required" },
      { status: 400 }
    );
  }

  try {
    // Parse the request body as JSON, expecting UpdateIdeaData type
    const body: UpdateIdeaData = await request.json();
    const { title, description, status, tags, priority } = body;

    // Prepare data for update. Use Partial<Idea> to allow for only updating specific fields.
    const dataToUpdate: Partial<Idea> = {};

    // Conditionally add fields to dataToUpdate if they are explicitly provided in the request body.
    // This allows for partial updates (PATCH-like behavior) even with a PUT method.
    if (title !== undefined) dataToUpdate.title = title;
    // Handle description: if explicitly null, set to null. Otherwise, trim string.
    if (description !== undefined) {
      dataToUpdate.description =
        description === null ? null : String(description).trim();
    }
    if (status !== undefined) dataToUpdate.status = status;
    // Ensure tags is an array, default to empty array if null/undefined is passed.
    if (tags !== undefined) dataToUpdate.tags = tags || [];
    if (priority !== undefined) dataToUpdate.priority = priority;

    // If no fields were provided in the body for update, return a 400 Bad Request
    if (Object.keys(dataToUpdate).length === 0) {
      console.warn(
        `PUT /api/ideas/${id}: No update fields provided in the request body.`
      );
      return NextResponse.json(
        { message: "No fields provided for update" },
        { status: 400 }
      );
    }

    // First, check if the idea actually exists before attempting to update it.
    const existingIdea = await prisma.idea.findUnique({
      where: { id: id },
    });

    if (!existingIdea) {
      console.warn(
        `PUT /api/ideas/${id}: Attempted to update non-existent idea with ID ${id}.`
      );
      return NextResponse.json({ message: "Idea not found" }, { status: 404 });
    }

    // Perform the update operation using Prisma
    const updatedIdea = await prisma.idea.update({
      where: { id: id },
      data: dataToUpdate,
    });

    // Return the updated idea with a 200 OK status
    return NextResponse.json(updatedIdea, { status: 200 });
  } catch (error: unknown) {
    // Ensure 'error' is typed as 'unknown' for stricter checks
    console.error(
      `API Error (PUT /api/ideas/${id}): Could not update idea:`,
      error
    );
    // Handle specific Prisma errors like unique constraint violations
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // P2002 is Prisma's unique constraint violation code
      // Extract the conflicting field from meta if available
      const field =
        (error.meta as { target?: string[] })?.target?.[0] || "unknown field";
      return NextResponse.json(
        { message: `An idea with this ${field} already exists.` },
        { status: 409 }
      ); // 409 Conflict
    }
    // Return a generic internal server error response for other errors
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ideas/[id]
 * Deletes an idea by its ID.
 * This is a Server-Side API route.
 */
export async function DELETE(
  request: NextRequest,
  props: RouteHandlerProps // Accept the full props object containing params
) {
  // CRUCIAL FIX: Explicitly await `props.params` for Turbopack compatibility.
  const { id } = await Promise.resolve(props.params);

  // Validate if the ID is provided in the URL
  if (!id) {
    console.error(
      "DELETE /api/ideas/[id]: Idea ID is missing in request params."
    );
    return NextResponse.json(
      { message: "Idea ID is required" },
      { status: 400 }
    );
  }

  try {
    // Check if the idea exists before attempting to delete to provide a more specific 404
    const existingIdea = await prisma.idea.findUnique({
      where: { id: id },
    });

    if (!existingIdea) {
      console.warn(
        `DELETE /api/ideas/${id}: Attempted to delete non-existent idea with ID ${id}.`
      );
      return NextResponse.json({ message: "Idea not found" }, { status: 404 });
    }

    // Perform the delete operation using Prisma
    await prisma.idea.delete({
      where: { id: id },
    });

    // Return a success message with a 200 OK status
    return NextResponse.json(
      { message: "Idea deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    // Ensure 'error' is typed as 'unknown'
    console.error(
      `API Error (DELETE /api/ideas/${id}): Could not delete idea:`,
      error
    );
    // Handle specific Prisma errors, e.g., if the record was already gone (unlikely after check)
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      // P2025 is Prisma's record not found error
      // You can access 'error.meta.cause' for more details if available
      return NextResponse.json(
        { message: `Idea not found (already deleted or never existed).` },
        { status: 404 }
      );
    }
    // Return a generic internal server error response for other errors
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
