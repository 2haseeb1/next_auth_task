// src/app/ideas/page.tsx
import React from 'react';
import { prisma } from '@/lib/prisma'; // Import your Prisma client
import { Idea } from '@/types/index'; // Import the Idea type
import IdeaCard from './IdeaCard'; // Import the new IdeaCard component
import Link from 'next/link';

// This is a Server Component, so it fetches data directly
export default async function IdeasPage() {
  let ideas: Idea[] = [];
  let error: string | null = null;

  try {
    // Fetch all ideas, ordered by creation date descending
    ideas = await prisma.idea.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      // You can include related user data if you want to display the user's name
      // include: {
      //   user: {
      //     select: { userName: true }
      //   }
      // }
    });
  } catch (err) {
    console.error("Failed to fetch ideas:", err);
    error = "Failed to load ideas. Please try again later.";
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Ideas</h1>

      <div className="flex justify-end mb-4">
        <Link href="/ideas/new" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow transition duration-300 ease-in-out">
          + Add New Idea
        </Link>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {ideas.length === 0 ? (
        <p className="text-gray-700 text-center text-lg mt-8">
          No ideas found. Start by adding a new idea!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}