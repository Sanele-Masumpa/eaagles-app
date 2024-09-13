// pages/api/pitches/sent.js

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "User not found. Please log in." }, { status: 401 });
  }

  try {
    // Find the user based on their Clerk ID
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: {
        sentFriendRequests: {
          include: {
            receiver: {
              include: {
                entrepreneurProfile: {
                  include: {
                    pitches: true // Include pitches associated with the entrepreneur's profile
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // Collect all pitches from the received friend requests
    const pitches = existingUser.sentFriendRequests.flatMap(fr =>
      fr.receiver.entrepreneurProfile?.pitches || []
    );

    return NextResponse.json({ pitches });
  } catch (error) {
    console.error('Error fetching pitches:', error);
    return NextResponse.json({ error: "Failed to fetch pitches" }, { status: 500 });
  }
}
