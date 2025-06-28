// src/app/tasks/page.tsx
import React from 'react';
import { prisma } from '@/lib/prisma'; // Import your Prisma client
import { Task } from '@/types/index'; // Only import Task, as TaskStatus is used within Task// Import necessary types
import Link from 'next/link';

// This is a Server Component, so it can directly fetch data using Prisma
export default async function TasksPage() {
  let tasks: Task[] = [];
  let error: string | null = null;

  try {
    tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      // If you need to include related data (like assigned user), you can add 'include':
      // include: {
      //   assignedTo: true, // Assuming you have a relation in your Prisma schema for 'assignedTo'
      // },
    });

  } catch (err) {
    console.error("Failed to fetch tasks:", err);
    error = "Failed to load tasks. Please try again later.";
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Tasks</h1>

      {error && <p className="text-red-500">{error}</p>}

      {tasks.length === 0 ? (
        <p className="text-gray-700">No tasks found. You can add tasks via Prisma Studio or another part of your application.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white">
              <h2 className="text-xl font-semibold text-blue-700">{task.title}</h2>
              {task.description && <p className="text-gray-600 mt-1">{task.description}</p>}
              <p className="text-sm text-gray-500 mt-2">Status: <span className={`font-medium ${
                  task.status === 'Todo' ? 'text-blue-500' :
                  task.status === 'InProgress' ? 'text-yellow-600' :
                  task.status === 'Done' ? 'text-green-600' :
                  'text-red-600' // For Blocked
              }`}>{task.status}</span></p>
              {task.dueDate && (
                <p className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              )}
              {task.assignedToId && (
                <p className="text-sm text-gray-500">Assigned To: {task.assignedToId}</p>
                // Ideally, you'd fetch user name based on assignedToId
              )}
              <Link href={`/projects/${task.projectId}/tasks/${task.id}`} className="text-blue-500 hover:underline mt-3 inline-block text-sm">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}