// src/lib/api.ts
// This file acts as a centralized client for your API endpoints.

import type {
  User,
  Idea,
  CreateIdeaData,
  UpdateIdeaData,
  Project,
  CreateProjectData,
  UpdateProjectData,
  Task,
  CreateTaskData,
  UpdateTaskData,
} from "@/types";

import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
} from "@/types/auth";

// Determine base API URL for client-side fetches
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_PATH || "/api";

// --- Helper for making authenticated fetch requests ---
// FIX: Make the 'body' parameter generic to avoid 'any' warning
async function fetchApi<T>( // T is the type of the body
  endpoint: string,
  method: string = "GET",
  token?: string | null,
  body?: T // Now 'body' is typed as T
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    cache: "no-store", // Always fetch fresh data for API calls
  };

  if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "An unknown error occurred" }));
    throw new Error(
      errorData.message ||
        `API error: ${response.status} ${response.statusText}`
    );
  }

  // Handle 204 No Content for DELETE operations
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// --- Auth API Endpoints ---
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return fetchApi<LoginCredentials>("/login", "POST", null, credentials); // Pass type for credentials
  },
  register: async (data: RegisterData): Promise<AuthResponse> => {
    return fetchApi<RegisterData>("/register", "POST", null, data); // Pass type for data
  },
  getProfile: async (token: string): Promise<User> => {
    return fetchApi<undefined>("/auth/profile", "GET", token); // undefined for no body
  },
  updateProfile: async (data: Partial<User>, token: string): Promise<User> => {
    return fetchApi<Partial<User>>("/auth/profile", "PATCH", token, data); // Pass type for data
  },
};

// --- Ideas API Endpoints ---
export const ideasApi = {
  getAll: async (token: string): Promise<Idea[]> => {
    return fetchApi<undefined>("/ideas", "GET", token); // undefined for no body
  },
  getById: async (id: string, token: string): Promise<Idea> => {
    return fetchApi<undefined>(`/ideas/${id}`, "GET", token); // undefined for no body
  },
  create: async (data: CreateIdeaData, token: string): Promise<Idea> => {
    return fetchApi<CreateIdeaData>("/ideas", "POST", token, data); // Pass type for data
  },
  update: async (
    id: string,
    data: UpdateIdeaData,
    token: string
  ): Promise<Idea> => {
    return fetchApi<UpdateIdeaData>(`/ideas/${id}`, "PUT", token, data); // Pass type for data
  },
  remove: async (id: string, token: string): Promise<void> => {
    return fetchApi<undefined>(`/ideas/${id}`, "DELETE", token); // undefined for no body
  },
};

// --- Projects API Endpoints ---
export const projectsApi = {
  getAll: async (token: string): Promise<Project[]> => {
    return fetchApi<undefined>("/projects", "GET", token); // undefined for no body
  },
  getById: async (id: string, token: string): Promise<Project> => {
    return fetchApi<undefined>(`/projects/${id}`, "GET", token); // undefined for no body
  },
  create: async (data: CreateProjectData, token: string): Promise<Project> => {
    return fetchApi<CreateProjectData>("/projects", "POST", token, data); // Pass type for data
  },
  update: async (
    id: string,
    data: UpdateProjectData,
    token: string
  ): Promise<Project> => {
    return fetchApi<UpdateProjectData>(`/projects/${id}`, "PUT", token, data); // Pass type for data
  },
  remove: async (id: string, token: string): Promise<void> => {
    return fetchApi<undefined>(`/projects/${id}`, "DELETE", token); // undefined for no body
  },
};

// --- Tasks API Endpoints ---
export const tasksApi = {
  getAll: async (projectId: string, token: string): Promise<Task[]> => {
    return fetchApi<undefined>(`/projects/${projectId}/tasks`, "GET", token); // undefined for no body
  },
  getById: async (
    projectId: string,
    taskId: string,
    token: string
  ): Promise<Task> => {
    return fetchApi<undefined>(
      `/projects/${projectId}/tasks/${taskId}`,
      "GET",
      token
    ); // undefined for no body
  },
  create: async (
    projectId: string,
    data: CreateTaskData,
    token: string
  ): Promise<Task> => {
    return fetchApi<CreateTaskData>(
      `/projects/${projectId}/tasks`,
      "POST",
      token,
      data
    ); // Pass type for data
  },
  update: async (
    projectId: string,
    taskId: string,
    data: UpdateTaskData,
    token: string
  ): Promise<Task> => {
    return fetchApi<UpdateTaskData>(
      `/projects/${projectId}/tasks/${taskId}`,
      "PUT",
      token,
      data
    ); // Pass type for data
  },
  remove: async (
    projectId: string,
    taskId: string,
    token: string
  ): Promise<void> => {
    return fetchApi<undefined>(
      `/projects/${projectId}/tasks/${taskId}`,
      "DELETE",
      token
    ); // undefined for no body
  },
};
