// src/components/common/Footer.tsx

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white p-6 mt-12 shadow-inner">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        {/* Copyright Information */}
        <div className="mb-4 md:mb-0">
          <p>&copy; {currentYear} TaskFlow. All rights reserved.</p>
          <p className="text-sm text-gray-400">Built with Next.js, TypeScript, and Prisma.</p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center md:justify-end space-x-4">
          <Link href="/privacy" className="hover:text-blue-400 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-blue-400 transition-colors">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-blue-400 transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;