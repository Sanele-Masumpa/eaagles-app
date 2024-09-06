import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/prisma'; // Adjust path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const {
        bio,
        company,
        businessStage,
        fundingHistory,
        linkedinUrl,
        revenue,
        investmentOpportunities,
        imageUrl,
      } = req.body;

      const clerkId = req.headers['clerk-id'] as string;

      if (!clerkId) {
        return res.status(400).json({ error: 'Clerk ID is required' });
      }

      const user = await db.user.findFirst({ where: { clerkId } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await db.entrepreneurProfile.upsert({
        where: { userId: user.id },
        update: {
          bio,
          company,
          businessStage,
          fundingHistory,
          linkedinUrl,
          revenue,
          imageUrl,
          investmentOpportunities: {
            upsert: investmentOpportunities.map((opp: any) => ({
              where: { title: opp.title },
              update: opp,
              create: opp,
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
          revenue,
          imageUrl,
          investmentOpportunities: {
            create: investmentOpportunities,
          },
        },
      });

      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
