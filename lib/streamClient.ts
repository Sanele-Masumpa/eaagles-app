import { StreamChat } from 'stream-chat';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const apiSecret = process.env.NEXT_PUBLIC_STREAM_API_SECRET!;
const client = StreamChat.getInstance(apiKey, apiSecret);

export default client;
