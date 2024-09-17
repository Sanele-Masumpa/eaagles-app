import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10); // Parse the user ID

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid user ID.' }, { status: 400 });
  }

  try {
    // Fetch entrepreneur's pitches by using entrepreneurId from EntrepreneurProfile model
    const pitches = await prisma.pitch.findMany({
      where: {
        entrepreneurId: id, // Use entrepreneurId to fetch related pitches
      },
      include: {
        entrepreneur: true, // Include the entrepreneur profile details
      },
    });

    if (pitches.length === 0) {
      return NextResponse.json({ message: "No pitches found for this entrepreneur." }, { status: 404 });
    }

    return NextResponse.json(pitches);
  } catch (error) {
    console.error('Error fetching pitches:', error);
    return NextResponse.json({ error: 'Failed to fetch pitches.' }, { status: 500 });
  }
}
