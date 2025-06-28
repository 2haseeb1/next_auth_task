// types/task.d.ts

import { BaseItem } from "./index.d";

import type { BaseItem } from "./index"; // Assuming BaseItem is in index.d.ts
// import type { User } from './index'; // Only uncomment if you intend to send the full User object for assignedTo

// Define TaskStatus enum if not already defined globally or from Prisma.
// However, it's better to import from '@prisma/client' as `enum TaskStatus { ... }`
// if you want to use the Prisma enum directly in your types.
// For client-side representation, a string might be sufficient.
export type TaskStatusType = "Todo" | "InProgress" | "Done" | "Blocked";

/**
 * Defines the status of a Task.
 */
export type TaskStatus = "todo" | "in-progress" | "review" | "done" | "blocked";

/**
 * Represents a single Task within a Project.
 */
export interface Task extends BaseItem {
  title: string;
  description?: string | null;
  status: TaskStatusType; // Use the string literal type
  dueDate?: string | null; // ISO string format from server, or null/undefined
  projectId: string;
  // CRITICAL FIX 1: Change assignedTo to be string | undefined, as it's an ID
  assignedTo?: string | null; // This will hold the ID of the assigned user, can be null or undefined
}

/**
 * Type for data used when creating a new Task.
 */
export interface CreateTaskData {
  title: string;
  description?: string | null;
  status?: TaskStatusType;
  dueDate?: string | null; // Can be a date string
  projectId: string; // Ensure this is present if creating a task for a specific project
  // CRITICAL FIX 2: Change `assignedTo` to `assignedToId` here to match the error's suggestion
  assignedToId?: string; // ID of the user to assign the task to (optional)
}
/**
 * Type for data used when updating an existing Task.
 */


export interface UpdateTaskData {
  title?: string;
  description?: string | null;
  status?: TaskStatusType;
  dueDate?: string | null; // Can be a date string
  // CRITICAL FIX 3: Change `assignedTo` to `assignedToId` here
  assignedToId?: string | null; // ID of the user to assign the task to (can be null to unassign)
}
export type UpdateTaskData = Partial<CreateTaskData>;
