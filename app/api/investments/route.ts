// pages/api/investments/index.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/prisma'; // Ensure you have Prisma client initialized

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const investments = await db.investment.findMany();
      res.status(200).json({ investments });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch investments' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
