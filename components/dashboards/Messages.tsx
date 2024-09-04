// components/Messages.tsx
import { Card } from '@nextui-org/react';

interface Message {
  id: number;
  content: string;
  sender: string;
  createdAt: string;
}

const Messages: React.FC = () => {
  // Placeholder messages data
  const messages: Message[] = [
    { id: 1, content: "Meeting scheduled for tomorrow.", sender: "Entrepreneur A", createdAt: new Date().toISOString() },
    // Add more messages as needed
  ];

  return (
    <Card>
      
    </Card>
  );
};

export default Messages;
