import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      console.error('User not authenticated');
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const clerkId = user.id;

    // Fetch the sender user from the database using clerkId
    const sender = await prisma.user.findUnique({
      where: { clerkId: clerkId }, // Use Clerk ID
    });

    if (!sender) {
      console.error('Sender user not found');
      return NextResponse.json({ error: 'Sender user not found' }, { status: 404 });
    }

    // Debug logging
    console.debug(`Fetching sent friend requests for user ID: ${sender.id}`);

    const sentRequests = await prisma.friendRequest.findMany({
      where: { senderId: sender.id },
      include: {
        receiver: {
          include: {
            entrepreneurProfile: true,
            investorProfile: true
          }
        }
      }
    });

    console.debug(`Fetched ${sentRequests.length} sent friend requests`);

    return NextResponse.json(sentRequests.map(req => ({
      id: req.receiver.id,
      name: req.receiver.name,
      email: req.receiver.email,
      imageUrl: req.receiver.imageUrl,
      role: req.receiver.role,
      entrepreneurProfile: req.receiver.entrepreneurProfile,
      investorProfile: req.receiver.investorProfile,
      status: req.status, // Include status in the response
    })));
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Failed to fetch sent requests:', error.message);
      return NextResponse.json({ error: 'Failed to fetch sent requests', details: error.message }, { status: 500 });
    } else {
      console.error('Unexpected error:', error);
      return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
    }
  }
}
