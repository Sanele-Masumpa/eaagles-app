import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    console.error("No user found. Please log in.");
    return NextResponse.json({ error: "User not found. Please log in." }, { status: 401 });
  }

  try {
    console.log(`Current User ID from Clerk: ${user.id}`);

    // Use the user ID as a string
    const userId = user.id;

    console.log(`User ID for Query: ${userId}`);

    // Fetch all users except the current user
    const users = await prisma.user.findMany({
      where: {
        clerkId: {
          not: userId, // Exclude the current user's clerkId
        },
      },
      include: {
        entrepreneurProfile: true,
        investorProfile: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
