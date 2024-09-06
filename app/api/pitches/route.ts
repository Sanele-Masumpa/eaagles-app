import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "User not found. Please log in." }, { status: 401 });
  }

  try {
    // Find the user based on clerkId
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found in the database" }, { status: 404 });
    }

    // Fetch the pitches for the found user
    const pitches = await prisma.pitch.findMany({
      where: { entrepreneurId: existingUser.id }, // Adjust this according to your actual schema
    });

    return NextResponse.json(pitches);
  } catch (error) {
    console.error("Error fetching pitches:", error);
    return NextResponse.json({ error: "Failed to fetch pitches" }, { status: 500 });
  }
}
