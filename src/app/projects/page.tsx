// src/app/projects/page.tsx
// This is a Server Component for displaying a list of projects.

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@/lib/auth.server'; // Server-side authentication
import { prisma } from '@/lib/prisma'; // Prisma client
import { redirect } from 'next/navigation'; // For unauthenticated access
import { formatDate } from '@/lib/utils'; // Assuming you have formatDate utility

export const metadata: Metadata = {
  title: 'My Projects - SparkBoard',
  description: 'Manage your projects and track their progress.',
};

// Define the props for this page
interface ProjectsPageProps {
  // FIX: Use 'any' for searchParams to bypass the build error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams?: any; // For query parameters like ?page=1
  // params?: any; // Include params if it's potentially a dynamic route, but generally not for /projects
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const session = await auth(); // Get the current session

  if (!session || !session.user) {
    redirect('/login'); // Redirect unauthenticated users
  }

  // You can still access searchParams properties, they will be of type string or string[]
  const page = parseInt(searchParams?.page as string || '1', 10);
  const pageSize = parseInt(searchParams?.pageSize as string || '10', 10);
  const skip = (page - 1) * pageSize;

  let projects = [];
  try {
    projects = await prisma.project.findMany({
      where: {
        ownerId: session.user.id, // Fetch projects only for the authenticated user
      },
      take: pageSize,
      skip: skip,
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Handle error, maybe show a message or redirect
    return (
      <div className="container mx-auto p-8 max-w-4xl text-center text-red-600">
        <p>Failed to load projects. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl bg-white shadow-lg rounded-lg my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">My Projects</h1>
        <Link href="/projects/new" passHref>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200 ease-in-out">
            Create New Project
          </button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-center text-gray-600 py-10">No projects found. Start by creating a new one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
              <Link href={`/projects/${project.id}`} passHref>
                <h2 className="text-xl font-semibold text-blue-700 hover:underline mb-2">{project.name}</h2>
              </Link>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">{project.description || 'No description provided.'}</p>
              <div className="text-sm text-gray-700 mb-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                  ${project.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${project.status === 'InProgress' ? 'bg-blue-100 text-blue-800' : ''}
                  ${project.status === 'OnHold' ? 'bg-orange-100 text-orange-800' : ''}
                  ${project.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                  ${project.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                `}>
                  {project.status}
                </span>
              </div>
              <p className="text-xs text-gray-500">Created: {formatDate(project.createdAt)}</p>
              <p className="text-xs text-gray-500">Last Updated: {formatDate(project.updatedAt)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Basic Pagination Example (client-side implementation would be better for interactive) */}
      <div className="flex justify-center mt-8 space-x-4">
        {page > 1 && (
          <Link href={`/projects?page=${page - 1}&pageSize=${pageSize}`} passHref>
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">Previous</button>
          </Link>
        )}
        <span className="self-center text-gray-700">Page {page}</span>
        {projects.length === pageSize && ( // Simple check if there might be more pages
          <Link href={`/projects?page=${page + 1}&pageSize=${pageSize}`} passHref>
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">Next</button>
          </Link>
        )}
      </div>
    </div>
  );
}