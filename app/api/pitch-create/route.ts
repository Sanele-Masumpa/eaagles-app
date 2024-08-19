// pages/api/pitch-create.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma'; // Adjust the path as necessary

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { title, description, entrepreneurId, category, fundingGoal, currentFunding, stage, deadline, locationId, tags, status, presentationDate } = req.body;

      const pitch = await prisma.pitch.create({
        data: {
          title,
          description,
          entrepreneurId,
          category,
          fundingGoal,
          currentFunding,
          stage,
          deadline: new Date(deadline),
          locationId,
          tags,
          status,
          presentationDate: new Date(presentationDate),
        },
      });

      res.status(201).json(pitch);
    } catch (error) {
      console.error('Error creating pitch:', error);
      res.status(500).json({ error: 'Failed to create pitch' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
