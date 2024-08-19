import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';
import formidable from 'formidable';
import fs from 'fs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "User not found. Please log in." }, { status: 401 });
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = './uploads'; // Directory to save uploaded files
  form.keepExtensions = true; // Keep original file extensions

  return new Promise((resolve, reject) => {
    form.parse(request, async (err, fields, files) => {
      if (err) {
        return resolve(NextResponse.json({ error: 'Error parsing form data' }, { status: 400 }));
      }

      const { title, description, category, fundingGoal, currentFunding, stage, status, presentationDate } = fields;
      const video = files.video[0]?.filepath; // Get the file path
      const pitchDeck = files.pitchDeck[0]?.filepath;

      try {
        const existingUser = await prisma.user.findUnique({
          where: { clerkId: user.id },
        });

        if (!existingUser) {
          return resolve(NextResponse.json({ error: "User profile not found" }, { status: 404 }));
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

        return resolve(NextResponse.json({
          message: 'Proposal created successfully',
          proposal: newProposal,
        }));
      } catch (error) {
        console.error('Error creating proposal:', error);
        return resolve(NextResponse.json({ error: "Failed to create proposal" }, { status: 500 }));
      }
    });
  });
}
