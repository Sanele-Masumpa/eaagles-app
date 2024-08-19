import type { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

type Data = {
  event: string;
  data: any;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { event, data }: Data = req.body;

    if (!event || !data) {
      return res.status(400).json({ error: 'Invalid request payload' });
    }

    try {
      pusher.trigger('my-channel', event, data);
      res.status(200).json({ message: 'Event triggered' });
    } catch (error) {
      console.error('Pusher trigger error:', error);
      res.status(500).json({ error: 'Failed to trigger event' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
