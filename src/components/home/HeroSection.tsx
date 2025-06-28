// src/components/home/HeroSection.tsx
'use client'; // This is explicitly a Client Component

import Image from "next/image";
import Link from "next/link"; // For the dynamic CTA links
import { cn } from "../../lib/utils"; // Assuming your cn utility path
import type { Session } from "../../lib/auth"; // Import Session type from auth lib

interface HeroSectionProps {
  session: Session | null; // Receive session as a prop from the Server Component
}

export default function HeroSection({ session }: HeroSectionProps) {
  const isLoggedIn = !!session?.user; // Check if user exists in the session

  return (
    <section
      className={cn(
        "flex flex-col items-center justify-center min-h-[500px] w-full",
        "bg-gradient-to-r from-blue-500 to-indigo-700 text-white",
        "p-8 rounded-xl shadow-lg relative overflow-hidden",
        "max-w-6xl mx-auto my-8"
      )}
    >
      {/* Optional: Add a subtle background pattern or overlay for visual interest */}
      <div className="absolute inset-0 bg-[url('https://placehold.co/800x600/000000/FFFFFF?text=Pattern')] opacity-10 bg-repeat bg-size-16"></div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 text-center z-10 drop-shadow-lg">
        Welcome to SparkBoard!
      </h1>
      <p className="text-lg sm:text-xl lg:text-2xl mb-6 text-center max-w-3xl z-10 opacity-90">
        Discover amazing features, streamline your workflows, and ignite your creativity with our cutting-edge solutions.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mb-8 z-10">
        {/* Dynamic CTA Button */}
        {isLoggedIn ? (
          <Link href="/ideas" passHref>
            <button className="bg-white text-indigo-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-md">
              Go to My Ideas
            </button>
          </Link>
        ) : (
          <Link href="/login" passHref>
            <button className="bg-white text-indigo-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-md">
              Get Started (Login/Signup)
            </button>
          </Link>
        )}
        {/* The "Learn More" button remains the same */}
        <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-indigo-700 transition duration-300 transform hover:scale-105 shadow-md">
          Learn More
        </button>
      </div>
      {/* Illustrative image */}
      <div className="mt-8 z-10">
        <Image
          src="https://placehold.co/150x150/6366F1/FFFFFF?text=SparkBoard.png"
          alt="Abstract Icon representing ideas"
          width={150}
          height={150}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full opacity-90 object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/150x150/6366F1/FFFFFF?text=Idea.png";
          }}
        />
      </div>
    </section>
  );
}