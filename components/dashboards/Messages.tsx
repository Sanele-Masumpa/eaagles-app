// components/Messages.tsx
import { Card, Text, List, Button } from '@nextui-org/react';

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
      <Card.Body>
        <Text h4>Messages</Text>
        <List>
          {messages.map(msg => (
            <List.Item key={msg.id}>
              <Text>{msg.content}</Text>
              <Text size="small" color="gray">{`From: ${msg.sender} - ${new Date(msg.createdAt).toLocaleDateString()}`}</Text>
            </List.Item>
          ))}
        </List>
        <Button color="primary">Compose Message</Button>
      </Card.Body>
    </Card>
  );
};

export default Messages;
