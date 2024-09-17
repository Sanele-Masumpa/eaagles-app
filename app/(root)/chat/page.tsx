import React from 'react';
import Chat from '@/components/Chat';

const ChatPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <Chat />
    </div>
  );
};

export default ChatPage;
