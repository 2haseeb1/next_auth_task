// src/app/profile/page.tsx
// This is a Server Component, indicated by the absence of 'use client' at the top.

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
// FIX: Import 'auth' and directly use 'Session' from '@/types/auth' in the function signature
import { auth } from '@/lib/auth.server'; 
import { formatDate } from '@/lib/utils'; 
import type { Session } from '@/types/auth'; // Keep this import for clarity and consistency, or remove if the below line suffices

export const metadata: Metadata = {
  title: 'User Profile - My Task App',
  description: 'View and manage your user profile details.',
};

export default async function ProfilePage() {
  // Use the Session type directly here
  const session: Session | null = await auth(); // <<<--- Explicitly type 'session' here using the imported Session

  if (!session || !session.user) {
    return (
      <div className="container mx-auto p-8 max-w-2xl bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700 mb-6">You must be logged in to view this page.</p>
        <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go to Login
        </Link>
      </div>
    );
  }

  const { user } = session;

  return (
    <div className="container mx-auto p-8 max-w-4xl bg-white shadow-lg rounded-lg">
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
            <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.315c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 79.246c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
          </li>
          <li>
            <span className="text-gray-900">Profile</span>
          </li>
        </ol>
      </nav>

      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">User Profile</h1>

      <div className="bg-gray-50 p-6 rounded-md shadow-inner mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">Username:</span>
            <span className="text-lg font-semibold text-gray-900">{user.userName}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">Email:</span>
            <span className="text-lg font-semibold text-gray-900">{user.email}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">User ID:</span>
            <span className="text-xs break-all font-mono text-gray-700 bg-gray-200 px-2 py-1 rounded">{user.id}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">Session Expires:</span>
            <span className="text-lg font-semibold text-gray-900">
              {formatDate(session.expires)} 
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">Created At:</span>
            <span className="text-lg font-semibold text-gray-900">
              {formatDate(user.createdAt)} 
            </span>
          </div>
           <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">Updated At:</span>
            <span className="text-lg font-semibold text-gray-900">
              {formatDate(user.updatedAt)} 
            </span>
          </div>
          {user.bio && (
            <div className="flex flex-col col-span-1 md:col-span-2">
              <span className="text-sm font-medium text-gray-500">Bio:</span>
              <span className="text-md text-gray-800">{user.bio}</span>
            </div>
          )}
          {user.roles && user.roles.length > 0 && (
            <div className="flex flex-col col-span-1 md:col-span-2">
              <span className="text-sm font-medium text-gray-500">Roles:</span>
              <span className="text-md text-gray-800">{user.roles.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}