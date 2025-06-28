// src/components/common/Sidebar.tsx

import Link from 'next/link';
// import { useAuth } from '@/hooks/useAuth'; // Uncomment if you have a custom auth hook

interface SidebarProps {
  isOpen: boolean; // Prop to control visibility (e.g., for mobile responsiveness)
  onClose?: () => void; // Optional function to close the sidebar
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  // const { user } = useAuth(); // Example: get user from auth context

  return (
    <>
      {/* Overlay for when sidebar is open on smaller screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 p-5 shadow-lg z-50 transform 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-auto lg:shadow-none`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/App Name */}
          <Link href="/" className="text-3xl font-extrabold mb-8 text-blue-400 hover:text-blue-300 transition-colors">
            TaskFlow
          </Link>

          {/* Navigation Links */}
          <nav className="flex-grow">
            <ul className="space-y-4">
              <li>
                <Link href="/dashboard" className="block text-lg hover:bg-gray-700 px-3 py-2 rounded-md transition-colors" onClick={onClose}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/projects" className="block text-lg hover:bg-gray-700 px-3 py-2 rounded-md transition-colors" onClick={onClose}>
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/tasks" className="block text-lg hover:bg-gray-700 px-3 py-2 rounded-md transition-colors" onClick={onClose}>
                  Tasks
                </Link>
              </li>
              <li>
                <Link href="/ideas" className="block text-lg hover:bg-gray-700 px-3 py-2 rounded-md transition-colors" onClick={onClose}>
                  Ideas
                </Link>
              </li>
              <li>
                <Link href="/users" className="block text-lg hover:bg-gray-700 px-3 py-2 rounded-md transition-colors" onClick={onClose}>
                  Users
                </Link>
              </li>
              {/* Add more links as needed */}
            </ul>
          </nav>

          {/* User/Profile Section (Optional) */}
          {/*
          {user && (
            <div className="mt-auto pt-6 border-t border-gray-700">
              <Link href="/profile" className="block text-lg hover:bg-gray-700 px-3 py-2 rounded-md transition-colors" onClick={onClose}>
                {user.userName || user.email}
              </Link>
              <button
                onClick={() => { logout(); onClose?.(); }} // logout and close sidebar
                className="w-full text-left mt-2 text-red-400 hover:bg-gray-700 px-3 py-2 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          )}
          */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;