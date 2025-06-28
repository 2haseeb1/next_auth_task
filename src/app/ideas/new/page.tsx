// src/app/ideas/new/page.tsx

import React from 'react';
import IdeaForm from './IdeaForm'; // Import the client component form
import type { Metadata } from 'next'; // Import Metadata type for SEO
import Link from 'next/link'; // For breadcrumb navigation

// Metadata for this specific page.
// This is a Server Component feature for SEO and browser tab titles.
export const metadata: Metadata = {
  title: 'Add New Idea - My Task App',
  description: 'Create a new idea to track and develop within your project management system.',
};

// This is a Server Component.
// It runs on the server to prepare the initial HTML, including any data fetching
// (though for a 'new' form, there's typically no data to fetch initially).
// It then renders client components like IdeaForm.
export default function NewIdeaPage() {
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      {/* Breadcrumb Navigation for better user experience */}
      <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
            {/* SVG for separator - replace with an icon component if you have one */}
            <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.315c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 79.246c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
          </li>
          <li className="flex items-center">
            <Link href="/ideas" className="text-blue-600 hover:text-blue-800">
              Ideas
            </Link>
            {/* SVG for separator */}
            <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.315c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 79.246c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
          </li>
          <li>
            <span className="text-gray-900">New</span> {/* Current page */}
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add New Idea</h1>
      
      {/* The IdeaForm is a Client Component imported here. 
          Its state and interactivity run on the client side after hydration. */}
      <IdeaForm />
    </div>
  );
}