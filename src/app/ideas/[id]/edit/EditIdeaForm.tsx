'use client'; // This is explicitly a Client Component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ideasApi } from '@/lib/api';
import { clientGetAuthToken } from '@/lib/auth.client';
import type { Idea, UpdateIdeaData, IdeaStatus, IdeaPriority } from '@/types'; 

interface EditIdeaFormProps {
  initialIdea: Idea; // Receive initial data from the Server Component
}

export default function EditIdeaForm({ initialIdea }: EditIdeaFormProps) {
  const router = useRouter();
  // Initialize formData directly from initialIdea
  const [formData, setFormData] = useState<UpdateIdeaData>({
    title: initialIdea.title,
    description: initialIdea.description,
    status: initialIdea.status,
    tags: initialIdea.tags,
    priority: initialIdea.priority,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'tags' ? value.split(',').map(tag => tag.trim()) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = await clientGetAuthToken();
      if (!token) {
        toast.error('Authentication required to update idea.');
        router.push('/login');
        return;
      }

      const dataToUpdate: UpdateIdeaData = {
        ...formData,
        tags: formData.tags ? (Array.isArray(formData.tags) ? formData.tags : []) : [], // Ensure tags is array
      };

      await ideasApi.update(initialIdea.id, dataToUpdate, token);
      toast.success('Idea updated successfully!');
      router.push('/ideas');
      router.refresh();
    } catch (error) {
      console.error('Failed to update idea:', error);
      toast.error('Failed to update idea. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const ideaStatuses: IdeaStatus[] = ['Draft', 'Prioritized', 'Archived', 'ConvertedToProject', 'Implemented'];
  const ideaPriorities: IdeaPriority[] = ['Low', 'Medium', 'High'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title || ''}
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
          {ideaStatuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
        <select
          id="priority"
          name="priority"
          value={formData.priority || ''}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={submitting}
        >
          <option value="">Select Priority</option>
          {ideaPriorities.map((priority) => (
            <option key={priority} value={priority}>{priority}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={submitting}
        />
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={() => router.push('/ideas')}
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
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
