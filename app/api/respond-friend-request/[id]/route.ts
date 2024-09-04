import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "User not found. Please log in." }, { status: 401 });
  }

  const { status } = await request.json();
  const { id } = params;

  if (!status || !['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!friendRequest) {
      return NextResponse.json({ error: "Friend request not found" }, { status: 404 });
    }

    // Ensure user.id is a number for comparison
    const userId = parseInt(user.id, 10);

    if (friendRequest.receiverId !== userId) {
      return NextResponse.json({ error: "You are not authorized to respond to this request" }, { status: 403 });
    }

    const updatedRequest = await prisma.friendRequest.update({
      where: { id: parseInt(id, 10) },
      data: { status },
    });

    return NextResponse.json({ message: 'Friend request status updated successfully', request: updatedRequest });
  } catch (error) {
    console.error('Error updating friend request status:', error);
    return NextResponse.json({ error: "Failed to update friend request status" }, { status: 500 });
  }
}
