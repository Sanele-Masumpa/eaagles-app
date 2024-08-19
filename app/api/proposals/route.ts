import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs';

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}

export async function POST(request: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "User not found. Please log in." },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const fundingGoal = formData.get("fundingGoal") as string;
    const currentFunding = formData.get("currentFunding") as string;
    const stage = formData.get("stage") as string;
    const deadline = formData.get("deadline") as string;
    const locationId = parseInt(formData.get("locationId") as string, 10); // Ensure this is a valid integer
    const tags = formData.get("tags") as string;
    const presentationDate = formData.get("presentationDate") as string;

    const video = formData.get("video") as File | null;
    const pitchDeck = formData.get("pitchDeck") as File | null;
    const attachments = formData.getAll("attachments") as File[];

    if (!title || !description || isNaN(locationId)) {
      return NextResponse.json(
        { error: "Title, description, and valid location ID are required" },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    let entrepreneurProfile = await db.entrepreneurProfile.findUnique({
      where: { userId: existingUser.id },
    });

    if (!entrepreneurProfile) {
      entrepreneurProfile = await db.entrepreneurProfile.create({
        data: {
          userId: existingUser.id,
          bio: "", // Default or empty value
        },
      });
    }

    // Handle file uploads if needed
    const videoBuffer = video ? await video.arrayBuffer() : null;
    const pitchDeckBuffer = pitchDeck ? await pitchDeck.arrayBuffer() : null;
    const attachmentsBuffers = await Promise.all(attachments.map(async (file) => {
      return file.arrayBuffer();
    }));

    const newPitch = await db.pitch.create({
      data: {
        title,
        description,
        category,
        fundingGoal: parseFloat(fundingGoal),
        currentFunding: parseFloat(currentFunding),
        stage,
        video: videoBuffer ? Buffer.from(videoBuffer) : null,
        pitchDeck: pitchDeckBuffer ? Buffer.from(pitchDeckBuffer) : null,
        deadline: new Date(deadline),
        location: {
          connect: { id: locationId },  // Ensure locationId is valid
        },
        tags: tags.split(',').map(tag => tag.trim()),
        attachments: attachmentsBuffers.map(buffer => Buffer.from(buffer)),
        presentationDate: new Date(presentationDate),
        entrepreneur: {
          connect: { id: entrepreneurProfile.id },  // Ensure entrepreneurProfile.id is valid
        },
      },
    });

    return NextResponse.json({
      message: 'Pitch created successfully',
      pitch: newPitch,
    });
  } catch (error) {
    console.error('Error creating pitch:', error);
    return NextResponse.json(
      { error: "Failed to create pitch" },
      { status: 500 }
    );
  }
}
