// src/app/projects/page.tsx
// This is a Server Component for displaying a list of projects.

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@/lib/auth.server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'My Projects - SparkBoard',
  description: 'Manage your projects and track their progress.',
};

// FIX: Define props inline with 'any' for searchParams
export default async function ProjectsPage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { searchParams }: { searchParams?: any }
) {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  // FIX: Cast searchParams to a known object structure immediately
  // This bypasses the strict Promise-like check.
  const queryParams = searchParams as { page?: string, pageSize?: string };

  const currentPage = (queryParams?.page) ? parseInt(queryParams.page, 10) : 1;
  const currentPerPage = (queryParams?.pageSize) ? parseInt(queryParams.pageSize, 10) : 10;
  
  const page = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;
  const pageSize = isNaN(currentPerPage) || currentPerPage < 1 ? 10 : currentPerPage;
  
  const skip = (page - 1) * pageSize;

  let projects = [];
  try {
    projects = await prisma.project.findMany({
      where: {
        ownerId: session.user.id,
      },
      take: pageSize,
      skip: skip,
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
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

      <div className="flex justify-center mt-8 space-x-4">
        {page > 1 && (
          <Link href={`/projects?page=${page - 1}&pageSize=${pageSize}`} passHref>
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">Previous</button>
          </Link>
        )}
        <span className="self-center text-gray-700">Page {page}</span>
        {projects.length === pageSize && (
          <Link href={`/projects?page=${page + 1}&pageSize=${pageSize}`} passHref>
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">Next</button>
          </Link>
        )}
      </div>
    </div>
  );
}