// types/project.d.ts

import { BaseItem, User, Tag, Category } from "./index.d";
import { Task } from "./task.d"; // Import Task type

/**
 * Defines the status of a Project.
 */
export type ProjectStatus =
  | "planning"
  | "in-progress"
  | "on-hold"
  | "completed"
  | "cancelled";

/**
 * Represents a single Project in SparkBoard.
 */
export type Project = BaseItem & {
  title: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string; // ISO 8601 string
  endDate?: string; // ISO 8601 string
  ownerId: string;
  owner?: User; // Optional: populated when fetching with relations
  members?: User[]; // For team projects
  tags?: Tag[];
  categoryId?: string;
  category?: Category; // Optional: populated when fetching with relations
  tasks?: Task[]; // Nested tasks for the project
  progressPercentage?: number; // Calculated based on tasks or manually set
  attachments?: string[]; // URLs to attachments
  originalIdeaId?: string; // Link back to the idea it originated from
};

/**
 * Type for data used when creating a new Project.
 */
export type CreateProjectData = {
  title: string;
  description?: string;
  status?: ProjectStatus; // Defaults to 'planning'
  startDate?: string;
  endDate?: string;
  ownerId: string;
  memberIds?: string[]; // IDs of members
  tagIds?: string[];
  categoryId?: string;
  attachments?: string[];
  originalIdeaId?: string;
};

/**
 * Type for data used when updating an existing Project.
 */
export type UpdateProjectData = Partial<CreateProjectData>;
