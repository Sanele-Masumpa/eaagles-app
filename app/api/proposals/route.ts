import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';

const db = new PrismaClient(); // Initialize the Prisma client

export async function POST(request: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "User not found. Please log in." },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();

    // Extract form fields
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const fundingGoal = formData.get("fundingGoal") as string;
    const currentFunding = formData.get("currentFunding") as string;
    const stage = formData.get("stage") as string;
    const deadline = formData.get("deadline") as string;
    const country = formData.get("country") as string;
    const city = formData.get("city") as string;
    const tags = formData.get("tags") as string;
    const presentationDate = formData.get("presentationDate") as string;

    // Handle file uploads
    const video = formData.get("video") as File | null;
    const pitchDeck = formData.get("pitchDeck") as File | null;
    const attachments = formData.getAll("attachments") as File[];

    // Validation
    if (!title || !description || !country || !city) {
      return NextResponse.json(
        { error: "Title, description, country, and city are required" },
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

    // Check if the location exists
    let location = await db.location.findUnique({
      where: {
        country_city: {
          country,
          city,
        },
      },
    });

    // Create the location if it does not exist
    if (!location) {
      location = await db.location.create({
        data: {
          country,
          city,
        },
      });
    }

    // Handle file buffers
    const videoBuffer = video ? await video.arrayBuffer() : null;
    const pitchDeckBuffer = pitchDeck ? await pitchDeck.arrayBuffer() : null;
    const attachmentsBuffers = await Promise.all(attachments.map(async (file) => {
      return file.arrayBuffer();
    }));

    // Create new pitch
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
          connect: { id: location.id },  // Use the ID of the existing or newly created location
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
