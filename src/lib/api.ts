// src/lib/api.ts

// Import types using the '@/types/' alias for consistency and reliability
// Assuming your type definitions are in files like src/types/index.ts, src/types/idea.ts, etc.
import type { User } from "@/types"; // Assuming User is in src/types/index.ts or src/types.ts
import type { Idea, CreateIdeaData } from "@/types/idea";
import type {
  Project,
  CreateProjectData,
  UpdateProjectData,
} from "@/types/project";
import type { Task, CreateTaskData, UpdateTaskData } from "@/types/task";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
} from "@/types/auth";

// Ensure your .env has NEXT_PUBLIC_API_BASE_PATH="/api"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_PATH || "/api";

/**
 * Generic function to handle API responses.
 * Throws an error if the response is not OK.
 */
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Something went wrong" }));
    throw new Error(errorData.message || "API request failed");
  }
  return response.json();
}

// --- Authentication API Calls ---

export const authApi = {
  /**
   * Logs in a user.
   * @param credentials User login credentials.
   * @returns AuthResponse with user data and token.
   * @throws Error if login fails.
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      // Changed from /auth/login to /login based on your API route
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return handleApiResponse<AuthResponse>(response);
  },

  /**
   * Registers a new user.
   * @param data User registration data.
   * @returns AuthResponse with new user data and token.
   * @throws Error if registration fails.
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      // Changed from /auth/register to /register
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleApiResponse<AuthResponse>(response);
  },

  /**
   * Fetches the currently authenticated user's profile.
   * Requires a valid token.
   * @param token The authentication token.
   * @returns User object.
   */
  getProfile: async (token: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      // Changed from /auth/profile to /profile
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return handleApiResponse<User>(response);
  },

  // Add a logout endpoint if your backend supports invalidating tokens
  logout: async (token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      // Changed from /auth/logout to /logout
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Logout failed");
    }
  },
};

// --- Ideas API Calls ---

export const ideasApi = {
  /**
   * Fetches all ideas for the authenticated user.
   * @param token Auth token.
   * @returns Array of Idea objects.
   */
  getAll: async (token: string): Promise<Idea[]> => {
    const response = await fetch(`${API_BASE_URL}/ideas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleApiResponse<Idea[]>(response);
  },

  /**
   * Fetches a single idea by ID.
   * @param id The ID of the idea.
   * @param token Auth token.
   * @returns The Idea object.
   */
  getById: async (id: string, token: string): Promise<Idea> => {
    const response = await fetch(`${API_BASE_URL}/ideas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleApiResponse<Idea>(response);
  },

  /**
   * Creates a new idea.
   * @param data The data for the new idea.
   * @param token Auth token.
   * @returns The created Idea object.
   */
  create: async (data: CreateIdeaData, token: string): Promise<Idea> => {
    const response = await fetch(`${API_BASE_URL}/ideas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handleApiResponse<Idea>(response);
  },

  /**
   * Updates an existing idea.
   * @param id The ID of the idea to update.
   * @param data The update data.
   * @param token Auth token.
   * @returns The updated Idea object.
   */
  update: async (
    id: string,
    data: Partial<CreateIdeaData>,
    token: string
  ): Promise<Idea> => {
    const response = await fetch(`${API_BASE_URL}/ideas/${id}`, {
      method: "PUT", // or PATCH depending on your API
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handleApiResponse<Idea>(response);
  },

  /**
   * Deletes an idea.
   * @param id The ID of the idea to delete.
   * @param token Auth token.
   */
  delete: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/ideas/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error("Failed to delete idea");
    }
  },
};

// --- Projects API Calls ---

export const projectsApi = {
  getAll: async (token: string): Promise<Project[]> => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleApiResponse<Project[]>(response);
  },

  getById: async (id: string, token: string): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleApiResponse<Project>(response);
  },

  create: async (data: CreateProjectData, token: string): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handleApiResponse<Project>(response);
  },

  update: async (
    id: string,
    data: UpdateProjectData,
    token: string
  ): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "PUT", // or PATCH
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handleApiResponse<Project>(response);
  },

  delete: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error("Failed to delete project");
    }
  },

  // Projects can also have nested task management APIs
  getTasks: async (projectId: string, token: string): Promise<Task[]> => {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/tasks`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleApiResponse<Task[]>(response);
  },

  createTask: async (
    projectId: string,
    data: CreateTaskData,
    token: string
  ): Promise<Task> => {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    return handleApiResponse<Task>(response);
  },

  updateTask: async (
    projectId: string,
    taskId: string,
    data: UpdateTaskData,
    token: string
  ): Promise<Task> => {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`,
      {
        method: "PUT", // or PATCH
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    return handleApiResponse<Task>(response);
  },

  deleteTask: async (
    projectId: string,
    taskId: string,
    token: string
  ): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
  },
};
