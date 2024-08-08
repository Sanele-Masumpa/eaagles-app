import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const user = await currentUser();

    if (!user) {
      return res.status(401).json({ error: 'User not found. Please log in.' });
    }

    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    try {
      // Check if the user already exists in the database
      let existingUser = await prisma.user.findUnique({
        where: { clerkId: user.id },
      });

      // If the user doesn't exist, create a new one
      if (!existingUser) {
        await prisma.user.create({
          data: {
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || '',
            name: user.fullName || '',
            imageUrl: user.imageUrl || '',
            role,
          },
        });
      } else if (!existingUser.role) {
        // If user exists and has no role assigned, update the role
        await prisma.user.update({
          where: { clerkId: user.id },
          data: {
            role,
          },
        });
      } else {
        // If the user already has a role assigned, prevent changing
        return res.status(400).json({ error: 'Role has already been assigned and cannot be changed' });
      }

      return res.status(200).json({ message: `Role ${role} assigned` });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to assign role' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
