// pages/api/pitch-create.ts
import { IncomingForm } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma'; // Adjust the path as necessary

export const config = {
  api: {
    bodyParser: false, // Important to disable Next.js default body parser
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      res.status(500).json({ error: 'Failed to parse form' });
      return;
    }

    try {
      const { title, description, entrepreneurId, category, fundingGoal, currentFunding, stage, deadline, locationId, tags, status, presentationDate } = fields;
      
      // Handle file paths if needed
      const videoPath = files.video ? (files.video[0] as any).filepath : null;
      const pitchDeckPath = files.pitchDeck ? (files.pitchDeck[0] as any).filepath : null;
      const attachmentsPaths = files.attachments ? (files.attachments as any[]).map((file: any) => file.filepath) : [];

      const pitch = await prisma.pitch.create({
        data: {
          title: title as string,
          description: description as string,
          entrepreneurId: Number(entrepreneurId),
          category: category as string,
          fundingGoal: Number(fundingGoal),
          currentFunding: Number(currentFunding),
          stage: stage as string,
          deadline: new Date(deadline as string),
          locationId: Number(locationId),
          tags: JSON.parse(tags as string),
          status: status as string,
          presentationDate: new Date(presentationDate as string),
          video: videoPath ? fs.readFileSync(videoPath).toString('base64') : null,
          pitchDeck: pitchDeckPath ? fs.readFileSync(pitchDeckPath).toString('base64') : null,
          attachments: attachmentsPaths.length > 0 ? attachmentsPaths.map(filePath => fs.readFileSync(filePath).toString('base64')) : [],
        },
      });

      res.status(201).json(pitch);
    } catch (error) {
      console.error('Error creating pitch:', error);
      res.status(500).json({ error: 'Failed to create pitch' });
    }
  });
}
