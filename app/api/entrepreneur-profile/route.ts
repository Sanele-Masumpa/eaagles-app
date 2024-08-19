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

  const { bio, company, businessStage, fundingHistory } = await request.json();

  try {
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
          bio: bio || "",
          company: company || "",
          businessStage: businessStage || "",
          fundingHistory: fundingHistory || "",
        },
      });
    } else {
      entrepreneurProfile = await prisma.entrepreneurProfile.update({
        where: { userId: existingUser.id },
        data: {
          bio: bio || entrepreneurProfile.bio,
          company: company || entrepreneurProfile.company,
          businessStage: businessStage || entrepreneurProfile.businessStage,
          fundingHistory: fundingHistory || entrepreneurProfile.fundingHistory,
        },
      });
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: entrepreneurProfile,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
