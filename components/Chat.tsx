import React, { useEffect, useState } from 'react';
import { Channel, Chat, ChannelHeader, MessageList, MessageInput } from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';
import client from '../lib/streamClient';

const Chat: React.FC = () => {
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    // Create or retrieve a channel
    const channel = client.channel('messaging', 'general', {
      name: 'General Chat',
    });
    setChannel(channel);
  }, []);

  if (!channel) return <div>Loading...</div>;

  return (
    <Chat client={client} theme="messaging light">
      <Channel channel={channel}>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>
  );
};

export default Chat;
