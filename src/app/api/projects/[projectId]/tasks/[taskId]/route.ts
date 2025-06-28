// src/app/api/projects/[projectId]/tasks/[taskId]/route.ts
// This API route handles operations for a single task within a project.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth.server";
// FIX: Removed 'Task' from import as it's not directly used here
import type { UpdateTaskData } from "@/types";

// GET handler to fetch a single task by ID within a project
export async function GET(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: { params: any }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const projectId: string = params.projectId;
  const taskId: string = params.taskId;

  try {
    console.log(
      `GET request for task ID: ${taskId} in project ID: ${projectId} at URL: ${request.url}`
    );

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
        projectId: projectId,
        project: {
          ownerId: session.user.id,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        assignedToId: true,
        projectId: true,
        createdAt: true,
        updatedAt: true,
        // priority: true, // Uncomment if you added priority to your Task schema
      },
    });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error(`Error fetching task ${taskId}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT/PATCH handler to update a task by ID within a project
export async function PUT(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: { params: any }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const projectId: string = params.projectId;
  const taskId: string = params.taskId;

  try {
    const body: UpdateTaskData = await request.json();
    console.log(
      `PUT request for task ID: ${taskId} in project ID: ${projectId}. Data:`,
      body
    );

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
        projectId: projectId,
        project: {
          ownerId: session.user.id,
        },
      },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        assignedToId: true,
        projectId: true,
        createdAt: true,
        updatedAt: true,
        // priority: true, // Uncomment if you added priority to your Task schema
      },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error(`Error updating task ${taskId}:`, error);
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json(
        { message: "Task not found or not authorized" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a task by ID within a project
export async function DELETE(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: { params: any }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const projectId: string = params.projectId;
  const taskId: string = params.taskId;

  try {
    console.log(
      `DELETE request for task ID: ${taskId} in project ID: ${projectId}`
    );

    await prisma.task.delete({
      where: {
        id: taskId,
        projectId: projectId,
        project: {
          ownerId: session.user.id,
        },
      },
    });

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 204 }
    );
  } catch (error) {
    console.error(`Error deleting task ${taskId}:`, error);
    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return NextResponse.json(
        { message: "Task not found or not authorized" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Failed to delete task" },
      { status: 500 }
    );
  }
}
