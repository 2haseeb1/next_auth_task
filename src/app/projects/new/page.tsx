// src/app/projects/new/page.tsx
'use client'; // This will be a client component for interactive form

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { projectsApi } from '@/lib/api'; // Assuming your API client for projects
import { clientGetAuthToken } from '@/lib/auth.client'; // Client-side auth
import type { CreateProjectData, ProjectStatus } from '@/types'; // Import types

export default function NewProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateProjectData>({
    name: '',
    description: '',
    status: 'Planning', // Default status
    assignedToUserIds: [], // Initialize as empty array
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle multi-select for assigned users (if applicable, or simpler input for now)
  const handleAssignedToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This is a simplified example. For multiple users, you might use a multi-select or token input.
    // For now, let's assume it's a comma-separated list of user IDs for simplicity.
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      assignedToUserIds: value.split(',').map(id => id.trim()).filter(Boolean),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = await clientGetAuthToken();
      if (!token) {
        toast.error('Authentication required to create project.');
        router.push('/login');
        return;
      }

      // Convert Date objects to ISO strings if your API expects them
      const dataToCreate: CreateProjectData = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        // Ensure status is correctly handled (it's already string literal)
      };

      await projectsApi.create(dataToCreate, token);
      toast.success('Project created successfully!');
      router.push('/projects'); // Go back to the projects list
      router.refresh(); // Refresh data on the projects list page
    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error('Failed to create project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const projectStatuses: ProjectStatus[] = ['Planning', 'InProgress', 'OnHold', 'Completed', 'Cancelled'];

  return (
    <div className="container mx-auto p-8 max-w-2xl bg-white shadow-lg rounded-lg my-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={submitting}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={submitting}
          ></textarea>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={submitting}
          >
            {projectStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate ? formData.startDate.split('T')[0] : ''} // Format for date input
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            disabled={submitting}
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate ? formData.endDate.split('T')[0] : ''} // Format for date input
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            disabled={submitting}
          />
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            disabled={submitting}
          />
        </div>

        <div>
          <label htmlFor="assignedToUserIds" className="block text-sm font-medium text-gray-700">Assigned To User IDs (comma-separated)</label>
          <input
            type="text"
            id="assignedToUserIds"
            name="assignedToUserIds"
            value={formData.assignedToUserIds ? formData.assignedToUserIds.join(', ') : ''}
            onChange={handleAssignedToChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            disabled={submitting}
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => router.push('/projects')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}