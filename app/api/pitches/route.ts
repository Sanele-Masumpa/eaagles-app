import { NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function POST(request: { formData: () => any; }) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "User not found. Please log in." }, { status: 401 });
  }

  const formData = await request.formData();
  const title = formData.get('title');
  const description = formData.get('description');
  const category = formData.get('category');
  const fundingGoal = parseFloat(formData.get('fundingGoal'));
  const currentFunding = parseFloat(formData.get('currentFunding'));
  const stage = formData.get('stage');
  const deadline = new Date(formData.get('deadline'));
  const locationId = parseInt(formData.get('locationId'), 10);
  const tags = formData.getAll('tags');
  const status = formData.get('status');
  const presentationDate = new Date(formData.get('presentationDate'));

  const video = formData.get('video');
  const pitchDeck = formData.get('pitchDeck');
  const attachments = formData.getAll('attachments');

  if (!title || !description) {
    return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { clerkId: user.id } });

    if (!existingUser) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    let entrepreneurProfile = await prisma.entrepreneurProfile.findUnique({ where: { userId: existingUser.id } });

    if (!entrepreneurProfile) {
      entrepreneurProfile = await prisma.entrepreneurProfile.create({ data: { userId: existingUser.id, bio: "" } });
    }

    // Upload files to Supabase
    const { data: videoData, error: videoError } = await supabase.storage.from('pitches').upload(`videos/${Date.now()}_${video.name}`, video);
    if (videoError) throw videoError;

    const { data: pitchDeckData, error: pitchDeckError } = await supabase.storage.from('pitches').upload(`pitchDecks/${Date.now()}_${pitchDeck.name}`, pitchDeck);
    if (pitchDeckError) throw pitchDeckError;

    const attachmentUrls = [];
    for (const attachment of attachments) {
      const { data: attachmentData, error: attachmentError } = await supabase.storage.from('pitches').upload(`attachments/${Date.now()}_${attachment.name}`, attachment);
      if (attachmentError) throw attachmentError;
      attachmentUrls.push(attachmentData.path);
    }

    const newPitch = await prisma.pitch.create({
      data: {
        title,
        description,
        entrepreneurId: entrepreneurProfile.id,
        video: videoData.path,
        pitchDeck: pitchDeckData.path,
        attachments: attachmentUrls,
        category,
        fundingGoal,
        currentFunding,
        stage,
        deadline,
        locationId,
        tags,
        status,
        presentationDate,
      },
    });

    return NextResponse.json({ message: 'Pitch created successfully', pitch: newPitch });
  } catch (error) {
    console.error('Error creating pitch:', error);
    return NextResponse.json({ error: "Failed to create pitch" }, { status: 500 });
  }
}
