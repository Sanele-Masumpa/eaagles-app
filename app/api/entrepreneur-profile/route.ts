import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import supabase from "@/lib/supabaseClient";
import { getAuth } from "@clerk/nextjs/server";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define the type for investment opportunities
interface InvestmentOpportunityInput {
  title: string;
  description?: string;
  amount?: number;
}

type UserRole = 'entrepreneur' | 'investor' | 'admin'; // Define roles

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { userId: clerkId } = await getAuth(request);

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { entrepreneurProfile: true },
    });

    if (!user || user.role !== 'ENTREPRENEUR') {
      console.log("Unauthorized access attempt with clerkId:", clerkId);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const bio = formData.get("bio") as string;
    const company = formData.get("company") as string;
    const businessStage = formData.get("businessStage") as string;
    const fundingHistory = formData.get("fundingHistory") as string;
    const linkedinUrl = formData.get("linkedinUrl") as string;
    const revenue = parseFloat(formData.get("revenue") as string);
    const investmentOpportunities = formData.get("investmentOpportunities") as string;
    const imageFile = formData.get("image") as File;

    let imageUrl = "";

    if (imageFile) {
      // Upload file to Supabase
      const { data, error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(`images/${clerkId}/${imageFile.name}`, imageFile);
    
      if (uploadError) throw uploadError;
    
      // Get the public URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from("profiles")
        .getPublicUrl(data.path);
    
      imageUrl = publicUrlData.publicUrl || "";
    }
    

    // Parse and validate investment opportunities
    const parsedInvestmentOpportunities: InvestmentOpportunityInput[] = investmentOpportunities
      ? JSON.parse(investmentOpportunities)
      : [];

    // Check for invalid investment opportunities
    const validOpportunities = parsedInvestmentOpportunities.filter(
      (opp) => opp.title && (opp.amount === undefined || !isNaN(opp.amount))
    );

    // Upsert the EntrepreneurProfile and handle investment opportunities
    await prisma.entrepreneurProfile.upsert({
      where: { userId: user.id },
      update: {
        bio,
        company,
        businessStage,
        fundingHistory,
        linkedinUrl,
        imageUrl,
        revenue,
        investmentOpportunities: {
          deleteMany: {},
          create: validOpportunities.map((opp) => ({
            title: opp.title,
            description: opp.description,
            amount: opp.amount,
            entrepreneurProfileId: user.id,
          })),
        },
      },
      create: {
        userId: user.id,
        bio,
        company,
        businessStage,
        fundingHistory,
        linkedinUrl,
        imageUrl,
        revenue,
        investmentOpportunities: {
          create: validOpportunities.map((opp) => ({
            title: opp.title,
            description: opp.description,
            amount: opp.amount,
            entrepreneurProfileId: user.id,
          })),
        },
      },
    });

    console.log("Profile updated successfully for userId:", user.id);
    toast.success("Profile updated successfully!");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update profile:", error);
    toast.error("Failed to update profile.");
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
