// src/types/idea.ts
import type { BaseItem, User } from "@/types"; // Import from common types

export interface Idea extends BaseItem {
  title: string;
  description: string | null;
  status: "Draft" | "Prioritized" | "Archived" | "Implemented";
  tags: string[];
  priority: "Low" | "Medium" | "High";
  userId: string;
  user?: User; // Optional: Link to the user who created it
}

export interface CreateIdeaData {
  title: string;
  description?: string | null;
  status?: "Draft" | "Prioritized" | "Archived" | "Implemented";
  tags?: string[];
  priority?: "Low" | "Medium" | "High";
}

