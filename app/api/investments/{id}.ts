// pages/api/investments/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/prisma'; // Ensure you have Prisma client initialized

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      await db.investment.delete({
        where: { id: Number(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete investment' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }


  if (req.method === 'PUT') {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    try {
      const updatedInvestment = await db.investment.update({
        where: { id: Number(id) },
        data: { title, description },
      });
      res.status(200).json({ investment: updatedInvestment });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update investment' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
