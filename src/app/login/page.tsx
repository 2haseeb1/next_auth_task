// src/app/login/page.tsx
// This is a Server Component.

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm'; // Import the client component form

export const metadata: Metadata = {
  title: 'Login - SparkBoard',
  description: 'Log in to your SparkBoard account to manage your ideas, projects, and tasks.',
};

export default function LoginPage() {
  return (
    <div className="container mx-auto p-4 max-w-md">
      <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
            <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.315c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 79.246c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
          </li>
          <li>
            <span className="text-gray-900">Login</span>
          </li>
        </ol>
      </nav>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Log In to SparkBoard</h1>
      <LoginForm />
      <p className="mt-4 text-center text-gray-600">
        {`Don't} have an account?`}{' '}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}