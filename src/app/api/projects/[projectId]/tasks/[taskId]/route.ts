// src/app/api/projects/[projectId]/tasks/[taskId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { TaskStatus, UpdateTaskData } from "@/types/index"; // Note: TaskPriority is removed as it's no longer used here

// Define the interface for the URL parameters
interface Params {
  projectId: string;
  taskId: string;
}

// Helper function to map incoming status strings (potentially from UI) to Prisma's TaskStatus enum
function mapToPrismaTaskStatus(uiStatus: string): TaskStatus | undefined {
  switch (uiStatus) {
    case "To Do":
    case "Todo":
      return "Todo";
    case "In Progress":
    case "InProgress":
      return "InProgress";
    case "Done":
      return "Done";
    case "Blocked":
      return "Blocked";
    default:
      return undefined;
  }
}

// GET /api/projects/[projectId]/tasks/[taskId]
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { projectId, taskId } = params;

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
        projectId: projectId,
      },
    });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error(
      `API Error: Could not fetch task ${taskId} for project ${projectId}:`,
      error
    );
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/[projectId]/tasks/[taskId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { projectId, taskId } = params;

  try {
    const body: UpdateTaskData = await request.json();

    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
        projectId: projectId,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        { message: "Task not found or does not belong to this project" },
        { status: 404 }
      );
    }

    const dataToUpdate: {
      title?: string;
      description?: string | null;
      status?: TaskStatus;
      dueDate?: Date | null;
      assignedToId?: string | null;
    } = {};

    if (body.title !== undefined) dataToUpdate.title = body.title;

    if (body.description !== undefined) {
      dataToUpdate.description =
        body.description === null ? null : String(body.description);
    }

    if (body.status !== undefined) {
      const prismaStatus = mapToPrismaTaskStatus(body.status);
      if (prismaStatus) {
        dataToUpdate.status = prismaStatus;
      } else {
        return NextResponse.json(
          { message: "Invalid Task Status provided" },
          { status: 400 }
        );
      }
    }

    if (body.dueDate !== undefined) {
      dataToUpdate.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    }
    if (body.assignedToId !== undefined) {
      dataToUpdate.assignedToId = body.assignedToId;
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error(
      `API Error: Could not update task ${taskId} for project ${projectId}:`,
      error
    );
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[projectId]/tasks/[taskId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { projectId, taskId } = params;

  try {
    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
        projectId: projectId,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        { message: "Task not found or does not belong to this project" },
        { status: 404 }
      );
    }

    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      `API Error: Could not delete task ${taskId} for project ${projectId}:`,
      error
    );
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
