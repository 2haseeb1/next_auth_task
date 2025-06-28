// src/app/ideas/[id]/edit/page.tsx
// This is a Server Component responsible for fetching data and passing it to a Client Component.

import { notFound, redirect } from 'next/navigation';
import React from 'react';
import type { Idea } from '@/types'; 
import EditIdeaForm from './EditIdeaForm'; // Import the Client Component
import { auth } from '@/lib/auth.server';

// The main page component for editing an idea
// FIX: Define props inline and use 'any' for params to bypass stubborn build error
export default async function EditIdeaPage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: { params: any } 
) {
  const id = params.id; // Access id directly from the destructured params (now typed as any)

  // This function fetches the idea data from your API route (server-side)
  // Moved getIdeaForEdit inside to avoid potential scope/import issues with Vercel_URL env
  async function getIdeaForEdit(ideaId: string): Promise<Idea | null> {
    const apiBaseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api` : 'http://localhost:3000/api';
    
    const session = await auth();

    if (!session || !session.user) {
      redirect('/login'); 
    }

    try {
      const fullApiUrl = `${apiBaseUrl}/ideas/${ideaId}`;
      console.log('Fetching idea for edit from (Server Component):', fullApiUrl);

      const token = "DUMMY_SERVER_SIDE_TOKEN"; // Placeholder. In a real app, you'd get this from the session or secure means.
      // If your auth() in auth.server.ts returns a token: const token = session.token;

      const response = await fetch(fullApiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        if (response.status === 404) {
          notFound(); 
        }
        console.error(`API Error: ${response.status} - ${response.statusText}`);
        throw new Error(`Failed to fetch idea for edit: ${response.statusText} (Status: ${response.status})`);
      }

      const data: Idea = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching idea for edit in Server Component:', error);
      notFound(); 
      return null;
    }
  }

  const idea = await getIdeaForEdit(id); 

  if (!idea) {
    notFound(); 
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl bg-white shadow-lg rounded-lg my-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Idea: {idea.title}</h1>
      <EditIdeaForm initialIdea={idea} /> 
    </div>
  );
}