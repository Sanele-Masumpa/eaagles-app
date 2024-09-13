// src/app/api/opportunities/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "User not found. Please log in." }, { status: 401 });
  }

  try {
    // Fetch the investor's user data from the database
    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found in database." }, { status: 404 });
    }

    // Fetch all entrepreneur profiles
    const entrepreneurs = await prisma.entrepreneurProfile.findMany({
      include: {
        user: true,
        pitches: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1, // Fetch the latest pitch
        },
      },
    });

    // Fetch accepted friend requests of the current investor
    const acceptedFriends = await prisma.friendRequest.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [
          { senderId: dbUser.id },
          { receiverId: dbUser.id },
        ],
      },
    });

    // Get friend IDs
    const friendIds = acceptedFriends.map((friendRequest) => {
      return friendRequest.senderId === dbUser.id
        ? friendRequest.receiverId
        : friendRequest.senderId;
    });

    // Return profiles and friendship status
    const results = entrepreneurs.map((entrepreneur) => ({
      entrepreneur,
      isFriend: friendIds.includes(entrepreneur.userId),
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json({ error: 'Failed to fetch opportunities.' }, { status: 500 });
  }
}
