// src/app/ideas/IdeaCard.tsx
'use client'; // This is a Client Component

import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Idea, IdeaStatus, IdeaPriority } from '@/types/index'; // Import necessary types

interface IdeaCardProps {
  idea: Idea;
}

// Helper to determine status display and color
const getIdeaStatusDisplay = (status: IdeaStatus) => {
  let displayName: string; // Declare displayName with its type
  let colorClass: string;  // Declare colorClass with its type

  switch (status) {
    case 'Draft':
      displayName = 'Draft';
      colorClass = 'bg-blue-100 text-blue-800';
      break;
    case 'Prioritized':
      displayName = 'Prioritized';
      colorClass = 'bg-yellow-100 text-yellow-800';
      break;
    case 'Archived':
      displayName = 'Archived';
      colorClass = 'bg-gray-300 text-gray-900';
      break;
    case 'ConvertedToProject': // <<<-- CRITICAL FIX: Changed from 'Converted to Project'
      displayName = 'Converted to Project'; // This is the human-readable display string
      colorClass = 'bg-purple-100 text-purple-800';
      break;
    default:
      // Fallback for any unexpected status, though types should prevent this
      displayName = status; // Assign the raw status value
      colorClass = 'bg-gray-200 text-gray-800';
      break;
  }
  return { displayName, colorClass };
};

// Helper to determine priority display and color
const getIdeaPriorityDisplay = (priority?: IdeaPriority | null) => {
  let displayName: string; // Declare displayName with its type
  let colorClass: string;  // Declare colorClass with its type

  if (!priority) {
    displayName = 'Not Set';
    colorClass = 'text-gray-500';
  } else {
    displayName = priority; // Assign the raw priority value first
    colorClass = 'text-gray-700'; // Default for specific priorities

    switch (priority) {
      case 'Low':
        colorClass = 'text-green-600';
        break;
      case 'Medium':
        colorClass = 'text-orange-600';
        break;
      case 'High':
        colorClass = 'text-red-600';
        break;
      // Add 'Critical' if you have it in IdeaPriority enum
      // case 'Critical':
      //   colorClass = 'text-purple-700 font-bold';
      //   break;
    }
  }
  return { displayName, colorClass };
};

const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const { displayName: statusDisplayName, colorClass: statusColorClass } = getIdeaStatusDisplay(idea.status);
  const { displayName: priorityDisplayName, colorClass: priorityColorClass } = getIdeaPriorityDisplay(idea.priority);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col h-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        <Link href={`/ideas/${idea.id}`} className="hover:text-blue-600 transition-colors">
          {idea.title}
        </Link>
      </h2>
      {idea.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {idea.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 text-sm mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColorClass}`}>
          {statusDisplayName}
        </span>
        {idea.priority && (
          <span className={`px-2 py-1 rounded-full bg-indigo-100 text-xs font-medium ${priorityColorClass}`}>
            Priority: {priorityDisplayName}
          </span>
        )}
        {idea.tags && idea.tags.length > 0 && (
          idea.tags.map(tag => (
            <span key={tag} className="px-2 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-medium">
              {tag}
            </span>
          ))
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200 text-xs text-gray-500">
        <p>Created: {format(new Date(idea.createdAt), 'MMM dd, yyyy')}</p>
        <p>Last Updated: {format(new Date(idea.updatedAt), 'MMM dd, yyyy')}</p>
        {/* If you include user in Prisma query: */}
        {/* {idea.user && <p>By: {idea.user.userName}</p>} */}
      </div>

      <div className="flex justify-end mt-4">
        <Link href={`/ideas/${idea.id}/edit`} className="text-blue-500 hover:underline text-sm font-medium">
          Edit
        </Link>
      </div>
    </div>
  );
};

export default IdeaCard;