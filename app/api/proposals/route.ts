import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

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
    const locationId = parseInt(formData.get("locationId") as string); // Assuming locationId is provided
    const tags = formData.get("tags") as string;
    const presentationDate = formData.get("presentationDate") as string;

    const video = formData.get("video") as File | null;
    const pitchDeck = formData.get("pitchDeck") as File | null;
    const attachments = formData.getAll("attachments") as File[];

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    let entrepreneurProfile = await prisma.entrepreneurProfile.findUnique({
      where: { userId: existingUser.id },
    });

    if (!entrepreneurProfile) {
      entrepreneurProfile = await prisma.entrepreneurProfile.create({
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

    const videoURL = video ? `/uploads/${video.name}` : null;
    const pitchDeckURL = pitchDeck ? `/uploads/${pitchDeck.name}` : null;
    const attachmentsURLs = await Promise.all(attachments.map(async (file) => {
      return `/uploads/${file.name}`;
    }));

    const newPitch = await prisma.pitch.create({
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
          connect: { id: locationId },
        },
        tags: tags.split(',').map(tag => tag.trim()),
        attachments: attachmentsBuffers.map(buffer => Buffer.from(buffer)),
        presentationDate: new Date(presentationDate),
        entrepreneur: {
          connect: { id: entrepreneurProfile.id },
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
