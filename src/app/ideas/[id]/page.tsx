// src/app/ideas/[id]/page.tsx
import { notFound } from 'next/navigation';
import React from 'react';
import { Idea } from '@/types/index';

interface IdeaDetailPageProps {
  params: {
    id: string;
  };
}

async function getIdea(id: string): Promise<Idea | null> {
  // Use the new environment variables
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const apiBasePath = process.env.NEXT_PUBLIC_API_BASE_PATH;

  // Add robust checks
  if (!appUrl) {
    console.error("NEXT_PUBLIC_APP_URL is not defined.");
    return null;
  }
  if (!apiBasePath) {
    console.error("NEXT_PUBLIC_API_BASE_PATH is not defined.");
    return null;
  }

  try {
    // Combine them to form the absolute URL for server-side fetch
    // Ensure no double slashes if apiBasePath starts with a slash
    const fullApiUrl = `${appUrl}${apiBasePath}/ideas/${id}`;
    console.log('Fetching from:', fullApiUrl); // Good for debugging

    const response = await fetch(fullApiUrl, {
      // You can add cache options here if needed, e.g.,
      // next: { revalidate: 60 }, // Revalidate every 60 seconds (ISR)
      // cache: 'no-store', // Always fetch fresh data (SSR-like)
    });

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch idea: ${response.statusText}`);
    }

    const data: Idea = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching idea in page:', error);
    return null;
  }
}

// The main page component
export default async function IdeaDetailPage(props: IdeaDetailPageProps) {
  // Keep this fix for the 'params' error (await Promise.resolve)
  const resolvedParams = await Promise.resolve(props.params);
  const id = resolvedParams.id;

  const idea = await getIdea(id);

  if (!idea) {
    notFound(); // Triggers Next.js 404 page if idea is null
  }

  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{idea.title}</h1>
      {idea.description && (
        <p className="text-gray-700 text-lg mb-4">{idea.description}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 mb-6">
        <div>
          <p><strong>Status:</strong> <span className={`font-semibold ${idea.status === 'Draft' ? 'text-blue-600' : idea.status === 'Prioritized' ? 'text-green-600' : 'text-gray-600'}`}>{idea.status.split(/(?=[A-Z])/).join(' ')}</span></p>
          {idea.priority && <p><strong>Priority:</strong> <span className={`font-semibold ${idea.priority === 'High' ? 'text-red-600' : idea.priority === 'Medium' ? 'text-orange-600' : 'text-green-600'}`}>{idea.priority}</span></p>}
        </div>
        <div>
          <p><strong>Created At:</strong> {new Date(idea.createdAt).toLocaleString()}</p>
          <p><strong>Last Updated:</strong> {new Date(idea.updatedAt).toLocaleString()}</p>
        </div>
      </div>

      {idea.tags && idea.tags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {idea.tags.map((tag, index) => (
              <span key={index} className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}