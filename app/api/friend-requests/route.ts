import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "User not found. Please log in." }, { status: 401 });
  }

  // Convert user.id to a number
  const userIdNumber = parseInt(user.id, 10);

  try {
    const sentRequests = await prisma.friendRequest.findMany({
      where: { senderId: userIdNumber },
      include: { receiver: true },
    });

    const receivedRequests = await prisma.friendRequest.findMany({
      where: { receiverId: userIdNumber },
      include: { sender: true },
    });

    return NextResponse.json({
      sentRequests,
      receivedRequests,
    });
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    return NextResponse.json({ error: "Failed to fetch friend requests" }, { status: 500 });
  }
}
