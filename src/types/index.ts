// src/types/index.ts
// This file contains ALL common and core application-wide types.
// It is the single source of truth for these definitions.

// --- COMMON BASE TYPES ---
export interface BaseItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- USER RELATED TYPES ---
// This must EXACTLY match your Prisma User model structure.
export interface User {
  id: string;
  email: string;
  userName: string | null;
  roles?: string[]; // Assuming roles can be an array of strings
  bio?: string | null; // Assuming bio can be string or null
  createdAt: Date;
  updatedAt: Date;
}

// --- PROJECT RELATED TYPES ---
export type ProjectStatus =
  | "Planning"
  | "InProgress"
  | "OnHold"
  | "Completed"
  | "Cancelled";

export interface Project extends BaseItem {
  name: string;
  description: string | null;
  status: ProjectStatus;
  ownerId: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  budget?: number | null;
  assignedToUserIds: string[]; // Array of user IDs
  ideaId?: string | null;
}

export interface CreateProjectData {
  name: string;
  description?: string | null;
  status?: ProjectStatus;
  startDate?: string | null; // Use string for API input (ISO date string)
  endDate?: string | null; // Use string for API input (ISO date string)
  budget?: number | null;
  ownerId?: string | null;
  assignedToUserIds?: string[];
  ideaId?: string | null;
}

export interface UpdateProjectData {
  name?: string;
  description?: string | null;
  status?: ProjectStatus;
  startDate?: string | null;
  endDate?: string | null;
  budget?: number | null;
  ownerId?: string | null;
  assignedToUserIds?: string[];
  ideaId?: string | null;
}

// --- IDEA RELATED TYPES ---
// FIX: Re-evaluated IdeaStatus based on common app usage, including "Implemented"
export type IdeaStatus =
  | "Draft"
  | "Prioritized"
  | "Archived"
  | "ConvertedToProject"
  | "Implemented"; // Added "Implemented" as per the error message's context
export type IdeaPriority = "Low" | "Medium" | "High";

export interface Idea extends BaseItem {
  title: string;
  description: string | null;
  status: IdeaStatus; // Using the IdeaStatus type
  tags: string[];
  priority?: IdeaPriority | null;
  userId: string; // ID of the user who owns the idea
}

export interface CreateIdeaData {
  title: string;
  description?: string | null;
  status?: IdeaStatus; // Using the IdeaStatus type
  tags?: string[];
  priority?: IdeaPriority | null;
}

export interface UpdateIdeaData {
  title?: string;
  description?: string | null;
  status?: IdeaStatus; // Using the IdeaStatus type
  tags?: string[];
  priority?: IdeaPriority | null;
}

// --- TASK RELATED TYPES ---
export type TaskStatus = "Todo" | "InProgress" | "Done" | "Blocked";
export type TaskPriority = "Low" | "Medium" | "High" | "Critical";

export interface Task extends BaseItem {
  projectId: string; // Link to the parent project
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: Date | null;
  assignedToId: string | null; // ID of the user assigned to the task
  // priority?: TaskPriority | null; // Uncomment if you added 'priority' to your Task schema in Prisma
}

export interface CreateTaskData {
  projectId: string;
  title: string;
  description?: string | null;
  status?: TaskStatus;
  dueDate?: string | null;
  assignedToId?: string | null;
  // priority?: TaskPriority | null; // Uncomment if you added 'priority' to your Task schema in Prisma
}

export interface UpdateTaskData {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  dueDate?: string | null;
  assignedToId?: string | null;
  // priority?: TaskPriority | null; // Uncomment if you added 'priority' to your Task schema in Prisma
}
