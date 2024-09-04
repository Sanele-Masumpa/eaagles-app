// pages/api/investments/create.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/prisma'; // Ensure you have Prisma client initialized

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    try {
      const newInvestment = await db.investment.create({
        data: {
          title,
          description,
        },
      });
      res.status(201).json({ investment: newInvestment });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create investment' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
