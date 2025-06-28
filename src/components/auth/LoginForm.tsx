// src/components/auth/LoginForm.tsx
'use client'; // This is a Client Component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast'; // For notifications
// FIX: Import clientSetAuthSession directly from auth.client.ts
import { clientSetAuthSession } from '@/lib/auth.client'; 
import type { AuthResponse } from '@/types/auth'; // Import AuthResponse type

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const { user, token, expires }: AuthResponse = await response.json();
      
      const expiryDate = new Date(expires);
      // FIX: Use clientSetAuthSession here
      await clientSetAuthSession(token, expiryDate); 
      
      toast.success(`Welcome, ${user.name}!`); 
      router.push('/ideas');
      router.refresh(); 
    } catch (error: unknown) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please check your credentials.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
        errorMessage = (error as { message: string }).message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
          Email:
        </label>
        <input
          type="email"
          id="email"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          autoComplete="email"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
          Password:
        </label>
        <input
          type="password"
          id="password"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          autoComplete="current-password"
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Logging In...' : 'Login'}
        </button>
      </div>
    </form>
  );
}