// src/app/api/friend-request/[id]/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const requestDetails = await prisma.friendRequest.findUnique({
      where: { id: parseInt(id, 10) },
      include: { sender: true, receiver: true },
    });

    if (!requestDetails) {
      return NextResponse.json({ error: "Friend request not found" }, { status: 404 });
    }

    return NextResponse.json({ request: requestDetails });
  } catch (error) {
    console.error('Error fetching friend request details:', error);
    return NextResponse.json({ error: "Failed to fetch friend request details" }, { status: 500 });
  }
}
