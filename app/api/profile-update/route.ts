import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { id, ...data } = req.body;
    try {
      const updatedProfile = await db.profile.update({
        where: { id },
        data,
      });
      res.status(200).json(updatedProfile);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
