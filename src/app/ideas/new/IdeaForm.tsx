// src/app/ideas/new/IdeaForm.tsx
'use client'; // This is a Client Component, as it uses React hooks and handles user interaction

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // For programmatic navigation
import toast from 'react-hot-toast'; // For displaying success/error notifications
import { IdeaStatus, IdeaPriority } from '@/types/index'; // Import your custom types for IdeaStatus and IdeaPriority

// --- Runtime Arrays for Select Options ---
// These arrays provide the actual string values to iterate over at runtime.
// This is necessary if IdeaStatus and IdeaPriority are defined as 'type' aliases (union of string literals)
// in your '@/types/index' file, rather than 'enum' declarations.
const allIdeaStatuses: IdeaStatus[] = ['Draft', 'Prioritized', 'Archived', 'ConvertedToProject'];
const allIdeaPriorities: IdeaPriority[] = ['Low', 'Medium', 'High'];

// Define the IdeaForm component
export default function IdeaForm() {
  const router = useRouter(); // Initialize Next.js router for redirection

  // State variables for form fields
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<IdeaStatus>('Draft'); // Default status to 'Draft'
  const [tags, setTags] = useState<string>(''); // Stores tags as a comma-separated string initially
  const [priority, setPriority] = useState<IdeaPriority | ''>(''); // Stores priority, allows empty string for optional

  // State for loading/submission status to disable form during API call
  const [loading, setLoading] = useState<boolean>(false);

  // --- Form Submission Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission to handle it via JavaScript
    setLoading(true); // Set loading state to true when submission starts

    // Prepare the data to be sent to the API
    const ideaData = {
      title,
      description: description.trim() === '' ? null : description.trim(), // Send null if description is empty or just whitespace
      status,
      // Process tags: split by comma, trim each tag, and filter out any empty strings
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      priority: priority === '' ? null : priority, // Send null if priority is not selected
    };

    try {
      // Make a POST request to your API route to create a new idea
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify content type as JSON
        },
        body: JSON.stringify(ideaData), // Convert JavaScript object to JSON string
      });

      // Check if the response was successful (HTTP status code 2xx)
      if (!response.ok) {
        const errorData = await response.json(); // Parse error response body
        // Throw an error with a message from the API or a generic one
        throw new Error(errorData.message || 'Failed to create idea');
      }

      const newIdea = await response.json(); // Parse the successful response body (the created idea)
      toast.success('Idea created successfully!'); // Display a success notification

      // Redirect the user to the detail page of the newly created idea
      // (Assuming you will implement /ideas/[id] later)
      router.push(`/ideas/${newIdea.id}`);
      // Alternatively, to go back to the main ideas list:
      // router.push('/ideas');
    } catch (error: unknown) { // Catch block to handle any errors during the submission process
      console.error('Error creating idea:', error); // Log the error for debugging

      let errorMessage = 'Error creating idea. Please try again.'; // Default error message

      // --- Type Narrowing and Error Message Extraction ---
      // This ensures that the message passed to toast.error is always a string.
      if (error instanceof Error) {
        // If it's a standard JavaScript Error object, use its message
        errorMessage = error.message;
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message: unknown }).message === 'string'
      ) {
        // If it's an object with a 'message' property (common for API errors)
        errorMessage = (error as { message: string }).message;
      } else if (typeof error === 'string') {
        // If the error itself is a string
        errorMessage = error;
      }

      toast.error(errorMessage); // Display the extracted (or default) error message
    } finally {
      setLoading(false); // Reset loading state regardless of success or failure
    }
  };

  // --- Render the Form UI ---
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      {/* Title Input Field */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
          Title:
        </label>
        <input
          type="text"
          id="title"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required // Make title a required field
          disabled={loading} // Disable input when form is submitting
          aria-label="Idea Title" // Accessibility improvement
        />
      </div>

      {/* Description Textarea Field */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
          Description (Optional):
        </label>
        <textarea
          id="description"
          rows={4} // Sets the visible number of lines in the text area
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading} // Disable textarea when form is submitting
          aria-label="Idea Description" // Accessibility improvement
        />
      </div>

      {/* Status Select Field */}
      <div className="mb-4">
        <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
          Status:
        </label>
        <select
          id="status"
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={status}
          onChange={(e) => setStatus(e.target.value as IdeaStatus)} // Cast value to IdeaStatus enum
          required // Status is a required field
          disabled={loading} // Disable select when form is submitting
          aria-label="Idea Status" // Accessibility improvement
        >
          {/* Use the new runtime array 'allIdeaStatuses' here */}
          {allIdeaStatuses.map((s) => (
            <option key={s} value={s}>
              {/* Convert CamelCase enum values to "Camel Case" for display */}
              {s.split(/(?=[A-Z])/).join(' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Priority Select Field */}
      <div className="mb-4">
        <label htmlFor="priority" className="block text-gray-700 text-sm font-bold mb-2">
          Priority (Optional):
        </label>
        <select
          id="priority"
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={priority}
          onChange={(e) => setPriority(e.target.value as IdeaPriority | '')} // Allow empty string for optional
          disabled={loading} // Disable select when form is submitting
          aria-label="Idea Priority" // Accessibility improvement
        >
          <option value="">-- Select Priority --</option> {/* Option for no priority selected */}
          {/* Use the new runtime array 'allIdeaPriorities' here */}
          {allIdeaPriorities.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Tags Input Field */}
      <div className="mb-6">
        <label htmlFor="tags" className="block text-gray-700 text-sm font-bold mb-2">
          Tags (comma-separated, Optional):
        </label>
        <input
          type="text"
          id="tags"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., UI/UX, Backend, New Feature" // Placeholder text
          disabled={loading} // Disable input when form is submitting
          aria-label="Idea Tags" // Accessibility improvement
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          disabled={loading} // Disable button while loading
          aria-label={loading ? 'Creating Idea...' : 'Create Idea'} // Accessibility improvement
        >
          {loading ? 'Creating Idea...' : 'Create Idea'} {/* Button text changes based on loading state */}
        </button>
      </div>
    </form>
  );
}