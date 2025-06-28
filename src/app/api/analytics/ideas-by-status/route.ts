// src/app/api/analytics/ideas-by-status/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Assuming your Prisma client is exported as 'prisma'

// FIX: Add eslint-disable-next-line to suppress unused var warnings for parameters

export async function GET(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _request: NextRequest, // 'request' parameter is intentionally unused
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: unknown // 'context' parameter is intentionally unused, and 'unknown' is a better type
) {
  try {
    // Optional: Add authentication/authorization check here if needed
    // If you uncomment these lines, make sure to remove the `// eslint-disable-next-line` above
    // and remove the underscore from `_request` to make it `request`.
    // const userId = _request.headers.get('x-user-id');
    // if (!userId) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    // Use Prisma's groupBy to count ideas by their status
    const ideasByStatus = await prisma.idea.groupBy({
      by: ["status"], // Group by the 'status' field
      _count: {
        id: true, // Count the number of ideas for each status
      },
    });

    // Format the results for the API response
    const formattedResult = ideasByStatus.map((item) => ({
      status: item.status,
      count: item._count.id,
    }));

    return NextResponse.json(formattedResult, { status: 200 });
  } catch (error) {
    console.error("API Error: Could not fetch ideas by status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
