// types/idea.d.ts

import { BaseItem, User, Tag, Category } from "./index.d";

/**
 * Defines the status of an Idea.
 * 
 * 
 */

import { IdeaStatus, IdeaPriority } from "@prisma/client"; // <-- Import these

// Define the data structure for creating a new idea
export interface CreateIdeaData {
  title: string;
  description?: string;
  status?: IdeaStatus; // <-- Use Prisma's enum type
  tags?: string[];
  priority?: IdeaPriority; // <-- Use Prisma's enum type
}

// Define the data structure for updating an existing idea.
// For incoming data from a client, it's safer to allow strings for enums
// and then transform them on the backend.
export interface UpdateIdeaData {
  title?: string;
  description?: string;
  status?: IdeaStatus | string; // Allow string here for incoming data, then convert
  tags?: string[];
  priority?: IdeaPriority | string; // Allow string here for incoming data, then convert
}
export type IdeaStatus =
  | "draft"
  | "backlog"
  | "prioritized"
  | "archived"
  | "convertedToProject";

/**
 * Represents a single Idea in SparkBoard.
 */
export type Idea = BaseItem & {
  title: string;
  description?: string;
  content?: string; // Rich text content for detailed descriptions
  status: IdeaStatus;
  authorId: string;
  author?: User; // Optional: populated when fetching with relations
  tags?: Tag[];
  categoryId?: string;
  category?: Category; // Optional: populated when fetching with relations
  isPublic?: boolean; // For potential future public sharing
  attachments?: string[]; // URLs to attachments
};

/**
 * Type for data used when creating a new Idea.
 */
export type CreateIdeaData = {
  title: string;
  description?: string;
  content?: string;
  status?: IdeaStatus; // Defaults to 'draft'
  authorId: string; // The ID of the creating user
  tagIds?: string[]; // IDs of tags to associate
  categoryId?: string;
  isPublic?: boolean;
  attachments?: string[];
};

/**
 * Type for data used when updating an existing Idea.
 */
export type UpdateIdeaData = Partial<CreateIdeaData>; // All properties are optional for updates
