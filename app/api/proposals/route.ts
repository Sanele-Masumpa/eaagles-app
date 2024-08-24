import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';
import formidable from 'formidable';
import fs from 'fs';
import util from 'util';

const prisma = new PrismaClient();

// Convert the formidable parse function into a promise-based function
const parseForm = util.promisify(formidable().parse);

export async function POST(request: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "User not found. Please log in." }, { status: 401 });
  }

  try {
    // Parse the form data
    const { fields, files } = await parseForm(request);

    const { title, description, category, fundingGoal, currentFunding, stage, status, presentationDate } = fields;
    const video = files.video[0]?.filepath; // Get the file path
    const pitchDeck = files.pitchDeck[0]?.filepath;

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    let entrepreneurProfile = await prisma.entrepreneurProfile.findUnique({
      where: { userId: existingUser.id },
    });

    if (!entrepreneurProfile) {
      entrepreneurProfile = await prisma.entrepreneurProfile.create({
        data: {
          userId: existingUser.id,
          bio: "",
        },
      });
    }

    const newProposal = await prisma.proposal.create({
      data: {
        title,
        description,
        category,
        fundingGoal: Number(fundingGoal),
        currentFunding: Number(currentFunding),
        stage,
        video,
        pitchDeck,
        status,
        presentationDate: new Date(presentationDate),
        entrepreneurId: entrepreneurProfile.id,
      },
    });

    return NextResponse.json({
      message: 'Proposal created successfully',
      proposal: newProposal,
    });
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json({ error: "Failed to create proposal" }, { status: 500 });
  }
}
