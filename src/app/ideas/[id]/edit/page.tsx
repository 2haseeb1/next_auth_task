// src/app/ideas/[id]/edit/page.tsx
import { notFound } from 'next/navigation';
import React from 'react';
import { Idea } from '@/types/index'; // Assuming your Idea type is here
// You might also need a form component or similar here later

interface EditIdeaPageProps {
  params: {
    id: string; // The dynamic 'id' from the URL
  };
}

// This function fetches the idea data from your API route
async function getIdeaForEdit(id: string): Promise<Idea | null> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const apiBasePath = process.env.NEXT_PUBLIC_API_BASE_PATH;

  if (!appUrl || !apiBasePath) {
    console.error("Environment variables NEXT_PUBLIC_APP_URL or NEXT_PUBLIC_API_BASE_PATH are not defined.");
    return null;
  }

  try {
    const fullApiUrl = `${appUrl}${apiBasePath}/ideas/${id}`;
    console.log('Fetching idea for edit from:', fullApiUrl);

    const response = await fetch(fullApiUrl, {
      // For edit page, you usually want fresh data, so 'no-store' or revalidation
      cache: 'no-store', // Always fetch fresh data for editing
    });

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch idea for edit: ${response.statusText}`);
    }

    const data: Idea = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching idea for edit in page:', error);
    return null;
  }
}


// The main page component for editing an idea
export default async function EditIdeaPage(props: EditIdeaPageProps) {
  // Apply the 'await Promise.resolve' fix for params here too!
  const resolvedParams = await Promise.resolve(props.params);
  const id = resolvedParams.id;

  const idea = await getIdeaForEdit(id);

  if (!idea) {
    notFound(); // Trigger Next.js 404 page if idea not found
  }

  // Once you have the idea, you can pass it to a form component
  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Edit Idea: {idea.title}</h1>
      
      {/* You'll put your actual edit form here */}
      <form className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={idea.title}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            defaultValue={idea.description || ''}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
        {/* Add more fields for status, tags, priority etc. */}
        {/* Example for status (you'd use a select input usually) */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <input
            type="text"
            id="status"
            name="status"
            defaultValue={idea.status}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>

      <p className="mt-8 text-gray-500">
        This is the edit page for idea ID: {id}.
        Current title: {idea.title}
      </p>
    </div>
  );
}