// src/components/common/Navbar.tsx

import Link from 'next/link';
// import { useAuth } from '@/hooks/useAuth'; // Uncomment if you have a custom auth hook

const Navbar: React.FC = () => {
  // const { user, logout } = useAuth(); // Example: get user and logout function from auth context

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or App Name */}
        <Link href="/" className="text-2xl font-bold hover:text-blue-200 transition-colors">
          TaskFlow
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link href="/projects" className="hover:text-blue-200 transition-colors text-lg">
            Projects
          </Link>
          <Link href="/tasks" className="hover:text-blue-200 transition-colors text-lg">
            Tasks
          </Link>
          <Link href="/ideas" className="hover:text-blue-200 transition-colors text-lg">
            Ideas
          </Link>
          {/* Add more links as needed, e.g., Dashboard, Reports */}
        </div>

        {/* Authentication/User Section */}
        <div className="flex items-center space-x-4">
          {/* Example: Conditional rendering based on authentication state */}
          {/*
          {user ? (
            <>
              <span className="text-lg">Hello, {user.userName || user.email}!</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                Login
              </Link>
              <Link href="/auth/register" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors">
                Register
              </Link>
            </>
          )}
          */}
          <Link href="/profile" className="text-lg hover:text-blue-200 transition-colors">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;