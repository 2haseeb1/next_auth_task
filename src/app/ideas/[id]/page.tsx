// src/app/ideas/[id]/page.tsx
// This is a Server Component for displaying a single idea.

import { notFound, redirect } from 'next/navigation'; // Added redirect for unauthenticated access
import React from 'react';
import Link from 'next/link';
import { auth } from '@/lib/auth.server'; // Server-side authentication
import type { Idea } from '@/types'; // Import your Idea type from consolidated types
import { formatDate } from '@/lib/utils'; // Assuming you have formatDate utility

// Define the props for this dynamic page
interface IdeaDetailPageProps {
  // FIX: Use 'any' for params as a workaround for the build error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any; // The dynamic 'id' from the URL, e.g., { id: 'some-idea-id' }
  // searchParams?: { [key: string]: string | string[] }; // Optional, if you use query params
}

// Function to fetch the idea data from your API route (server-side)
async function getIdeaById(id: string): Promise<Idea | null> {
  const apiBaseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api` : 'http://localhost:3000/api';
  
  const session = await auth(); // Check session on the server

  if (!session || !session.user) {
    redirect('/login'); // Redirect unauthenticated users
  }

  try {
    const fullApiUrl = `${apiBaseUrl}/ideas/${id}`;
    console.log('Fetching idea details from (Server Component):', fullApiUrl);

    // Placeholder token. In a real app, you'd get this securely from the session.
    const token = "DUMMY_SERVER_SIDE_TOKEN"; 
    // If your auth() in auth.server.ts returns a token: const token = session.token;

    const response = await fetch(fullApiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`, // Use the token for API authentication
      },
      cache: 'no-store', // Always fetch fresh data for details page
    });

    if (!response.ok) {
      if (response.status === 404) {
        notFound(); // Trigger Next.js 404 page
      }
      console.error(`API Error: ${response.status} - ${response.statusText}`);
      throw new Error(`Failed to fetch idea: ${response.statusText} (Status: ${response.status})`);
    }

    const data: Idea = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching idea in Server Component:', error);
    notFound(); // Trigger Next.js 404 page for unexpected errors too
    return null; // Should not be reached
  }
}

// The main page component for displaying idea details
export default async function IdeaDetailPage({ params }: IdeaDetailPageProps) {
  const id: string = params.id; // Access the dynamic ID from props

  const idea = await getIdeaById(id); // Fetch data on the server

  if (!idea) {
    notFound(); // Double-check, though getIdeaById should handle it
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl bg-white shadow-lg rounded-lg my-8">
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link href="/ideas" className="text-blue-600 hover:text-blue-800">Ideas</Link>
            <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.315c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 79.246c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
          </li>
          <li>
            <span className="text-gray-900 truncate max-w-[150px] sm:max-w-none inline-block">{idea.title}</span>
          </li>
        </ol>
      </nav>

      <h1 className="text-4xl font-bold text-gray-800 mb-4 break-words">{idea.title}</h1>
      <p className={`text-sm font-semibold mb-6 
        ${idea.status === 'Draft' ? 'text-gray-500' : ''}
        ${idea.status === 'Prioritized' ? 'text-indigo-600' : ''}
        ${idea.status === 'Archived' ? 'text-red-500' : ''}
        ${idea.status === 'ConvertedToProject' ? 'text-green-600' : ''}
        ${idea.status === 'Implemented' ? 'text-blue-600' : ''}
      `}>
        Status: {idea.status}
        {idea.priority && ` • Priority: ${idea.priority}`}
      </p>

      {idea.description && (
        <div className="mb-6 bg-gray-50 p-4 rounded-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{idea.description}</p>
        </div>
      )}

      {idea.tags && idea.tags.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {idea.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600 mt-6 border-t pt-4">
        <p>Created: {formatDate(idea.createdAt)}</p>
        <p>Last Updated: {formatDate(idea.updatedAt)}</p>
        <p>Owner ID: <span className="font-mono text-xs bg-gray-200 px-1 py-0.5 rounded">{idea.userId}</span></p>
      </div>

      <div className="mt-8 flex gap-4">
        <Link href={`/ideas/${idea.id}/edit`} passHref>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200 ease-in-out">
            Edit Idea
          </button>
        </Link>
        {/* You could add a delete button here, handled by a Client Component */}
      </div>
    </div>
  );
}