// src/app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

// Import your common layout components
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
// import Sidebar from '@/components/common/Sidebar'; // Only uncomment if it's a global, always-present sidebar


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Task Manager App',
  description: 'A robust task management application built with Next.js, Prisma, and NextAuth.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // For a truly global sidebar that always displays:
  // You might need a state to manage its open/closed state, perhaps with a context API.
  // For simplicity here, we're just showing placement.

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased flex flex-col min-h-screen`}> {/* Use flexbox for sticky footer */}
        {/* React Hot Toast for global notifications */}
        <Toaster position="top-center" reverseOrder={false} />

        {/* Render the Navbar at the very top */}
        <Navbar />

        {/* Main content area - takes up remaining vertical space */}
        <main className="flex-grow">
          {/*
            Scenario 1: Global Sidebar (always present, next to main content)
            If you have a global sidebar, you'd typically structure it like this
            with flexbox or grid. You'd also need state management for 'isOpen'
            if your sidebar is collapsible/responsive.
          */}
          {/*
          <div className="flex">
            <Sidebar isOpen={true} /> // Pass state props if needed
            <div className="flex-grow p-4"> // Main content area next to sidebar
              {children} // Your page content renders here
            </div>
          </div>
          */}

          {/*
            Scenario 2: No Global Sidebar at root level, or sidebar used in nested layouts
            If your sidebar is not global, or if you prefer a simpler root layout,
            the children (your page content) go directly into 'main'.
          */}
          {children} {/* Your page content renders here */}
        </main>

        {/* Render the Footer at the bottom */}
        <Footer />
      </body>
    </html>
  );
}