// src/app/projects/ProjectCard.tsx

import Link from 'next/link';
import { format } from 'date-fns'; // Assuming you have date-fns installed for date formatting
import { Project, ProjectStatus } from '@/types/index'; // Import your Project and ProjectStatus types

// Define the props for your ProjectCard component
interface ProjectCardProps {
  project: Project;
}

// Helper function to get a display string and a color for the project status
const getStatusDisplay = (status: ProjectStatus) => {
  let displayName = status;
  let colorClass = 'bg-gray-200 text-gray-800'; // Default

  switch (status) {
    case 'Planning':
      displayName = 'Planning';
      colorClass = 'bg-blue-100 text-blue-800';
      break;
    case 'InProgress': // Corrected: "InProgress" (no space)
      displayName = 'InProgress'; // Display text can still have space
      colorClass = 'bg-yellow-100 text-yellow-800';
      break;
    case 'OnHold':
      displayName = 'OnHold';
      colorClass = 'bg-orange-100 text-orange-800';
      break;
    case 'Completed':
      displayName = 'Completed';
      colorClass = 'bg-green-100 text-green-800';
      break;
    case 'Cancelled':
      displayName = 'Cancelled';
      colorClass = 'bg-red-100 text-red-800';
      break;
    default:
      // Fallback for any unexpected status, though types should prevent this
      displayName = status;
      colorClass = 'bg-gray-200 text-gray-800';
      break;
  }
  return { displayName, colorClass };
};


const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { displayName, colorClass } = getStatusDisplay(project.status);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        <Link href={`/projects/${project.id}`} className="hover:text-blue-600 transition-colors">
          {project.name}
        </Link>
      </h2>
      {project.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 text-sm mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
          {displayName}
        </span>
        {project.ownerId && (
            <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-medium">
                Owner ID: {project.ownerId.substring(0, 8)}... {/* Shorten for display */}
            </span>
        )}
        {project.budget !== null && project.budget !== undefined && (
          <span className="px-2 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-medium">
            Budget: ${project.budget.toLocaleString()}
          </span>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200 text-xs text-gray-500">
        <p>Created: {format(new Date(project.createdAt), 'MMM dd, yyyy')}</p>
        <p>Last Updated: {format(new Date(project.updatedAt), 'MMM dd, yyyy')}</p>
        {project.startDate && (
          <p>Start Date: {format(new Date(project.startDate), 'MMM dd, yyyy')}</p>
        )}
        {project.endDate && (
          <p>End Date: {format(new Date(project.endDate), 'MMM dd, yyyy')}</p>
        )}
        {project.assignedToUserIds && project.assignedToUserIds.length > 0 && (
          <p>Assigned to: {project.assignedToUserIds.length} users</p>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;