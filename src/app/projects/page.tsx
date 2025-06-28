// src/app/projects/page.tsx (Example structure for a Server Component)

import { Project, ProjectStatus } from '@/types/index'; // Import your Project type
import {prisma} from '@/lib/prisma'; // Assuming your Prisma client instance
import ProjectCard from './ProjectCard'; // Assuming your ProjectCard component

interface ProjectsPageProps {
  // If you expect search params, you can define them here
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  let projects: Project[] = []; // Initialize as an empty array

  try {
    // --- THE CRITICAL FIX IS WITHIN THIS PRISMA QUERY ---
    // Ensure 'assignedToUserIds' is selected. If you have a 'select' clause,
    // you MUST explicitly add assignedToUserIds: true.
    // If you don't have a select clause, Prisma usually returns all scalar fields by default,
    // but explicitly including it is safer and clearer.

    projects = await prisma.project.findMany({
      // Example of a conditional where clause based on search params
      where: {
        status: searchParams?.status ? (searchParams.status as ProjectStatus) : undefined,
        // Add other filters if you have them
      },
      select: { // If you have a 'select' clause, make sure assignedToUserIds is here:
        id: true,
        name: true,
        description: true,
        status: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
        startDate: true,
        endDate: true,
        budget: true,
        assignedToUserIds: true, // <--- ADD THIS LINE if it's missing in your 'select'
        ideaId: true,
        // Include any other fields you need for the Project type
      },
      orderBy: {
        createdAt: 'desc', // Example ordering
      },
    }) as Project[]; // Cast to Project[] to satisfy TypeScript, though Prisma's generated types should align.

  } catch (error) {
    console.error('Failed to fetch projects:', error);
    // You might want to display an error message to the user or handle it gracefully
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Projects</h1>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}