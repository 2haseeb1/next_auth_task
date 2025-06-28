// src/components/projects/ProjectCard.tsx
"use client"; // This component needs to be a Client Component due to Link and potential interactions

import React from 'react'; // Although React is often auto-imported, explicitly adding it doesn't hurt and can prevent some linting errors.
import Link from 'next/link';
import type { Project } from '@/types/index'; // Ensure your Project type is defined here

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Helper function to dynamically apply status-based styling
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'InProgress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Planning':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800'; // Fallback for unknown status
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200">
      <div className="p-6">
        {/* Project Name as a clickable link to its detail page */}
        <Link href={`/projects/${project.id}`} className="block text-2xl font-bold text-blue-700 hover:text-blue-800 transition-colors mb-2">
          {project.name}
        </Link>

        {/* Project Description */}
        <p className="text-gray-600 text-sm mt-2 mb-4 line-clamp-3">
          {project.description || 'No description provided.'} {/* Display fallback if description is null/empty */}
        </p>

        {/* Status Badge and Creation Date */}
        <div className="flex items-center justify-between text-sm">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
          <span className="text-gray-500">
            Created: {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Action Buttons for the project card */}
      <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end space-x-3">
        <Link
          href={`/projects/${project.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
        >
          View Details
        </Link>
        <Link
          href={`/projects/${project.id}/edit`}
          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
        >
          Edit
        </Link>
        {/*
          You might add a delete button here. If you do, it should trigger a modal or
          a direct API call with confirmation, likely passed as a prop from the parent.
        */}
      </div>
    </div>
  );
};

export default ProjectCard;