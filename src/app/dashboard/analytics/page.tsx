// src/app/dashboard/analytics/page.tsx

import { cn } from '../../../lib/utils';
import Image from 'next/image'; // Import the Image component

export const metadata = {
  title: 'Analytics - SparkBoard',
  description: 'Detailed insights and trends for your ideas and projects.',
};

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Project & Idea Analytics
      </h1>
      <p className="text-gray-600">
        Dive deeper into your data with detailed charts and metrics.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ideas by Status Chart */}
        <div className={cn("bg-white p-6 rounded-lg shadow-md", "border border-gray-200")}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ideas by Status</h2>
          <div className="h-64 w-full relative"> {/* Added relative for Image fill */}
            <Image
              src="https://images.piclumen.com/normal/20250627/08/18c509bf3f6f43838dbbfd9e76bc3346.webp"
              alt="মাসিক কার্যকলাপের প্রবণতা দেখাচ্ছে এমন বার চার্ট, আইডিয়া, প্রোজেক্ট এবং টাস্কের জন্য"
              fill // Use 'fill' to make it fit parent, or specify width/height if not using fill
              // If using 'fill', you typically need object-fit classes on the parent div.
              className="object-contain rounded-md" // object-contain to keep aspect ratio
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 120vw, 33vw"
                       // Example sizes for responsiveness
              priority // For images in the initial viewport
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">Distribution of your ideas across different statuses.</p>
        </div>

        {/* Monthly Activity Bar Chart */}
        <div className={cn("bg-white p-6 rounded-lg shadow-md", "border border-gray-200")}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Activity Overview</h2>
          <div className="h-64 w-full relative"> {/* Added relative for Image fill */}
            <Image
              src="https://images.piclumen.com/normal/20250627/09/8ea992f97c3848a3978af4d40d7743a5.webp"
              alt="Monthly Activity Chart Placeholder"
              fill // Use 'fill' to make it fit parent, or specify width/height if not using fill
              className="object-contain rounded-md"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes for responsiveness
              priority // For images in the initial viewport
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">Insights into ideas, projects, and tasks created over time.</p>
        </div>
      </div>

      {/* Analytics Insights */}
      <div className={cn("bg-gray-50 p-6 rounded-lg shadow-md", "border border-gray-200")}>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Insights</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Average time from Idea to Project conversion: <span className="font-medium">15 days</span>.</li>
          <li>Most productive month: <span className="font-medium">March</span>, with 9,800 projects initiated.</li>
          <li>Top tag associated with converted ideas: <span className="font-medium">#Innovation</span>.</li>
        </ul>
      </div>
    </div>
  );
}