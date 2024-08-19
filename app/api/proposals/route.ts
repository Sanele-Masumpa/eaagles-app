import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust the import path as needed
import { currentUser } from '@clerk/nextjs';

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
    const locationData = formData.get("location") as string; // Expecting location as a string in the format "country,city"
    const tags = formData.get("tags") as string;
    const presentationDate = formData.get("presentationDate") as string;

    const video = formData.get("video") as File | null;
    const pitchDeck = formData.get("pitchDeck") as File | null;
    const attachments = formData.getAll("attachments") as File[];

    if (!title || !description || !locationData) {
      return NextResponse.json(
        { error: "Title, description, and location are required" },
        { status: 400 }
      );
    }

    const [country, city] = locationData.split(',').map(part => part.trim());

    // Check if the location exists
    let location = await prisma.location.findUnique({
      where: { country_city: { country, city } },
    });

    // Create the location if it doesn't exist
    if (!location) {
      location = await prisma.location.create({
        data: { country, city },
      });
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
          connect: { id: location.id }, // Use the ID of the location
        },
        tags: tags.split(',').map(tag => tag.trim()),
        attachments: attachmentsBuffers.map(buffer => Buffer.from(buffer)),
        presentationDate: new Date(presentationDate),
        entrepreneur: {
          connect: { id: entrepreneurProfile.id }, // Ensure entrepreneurProfile.id is valid
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
