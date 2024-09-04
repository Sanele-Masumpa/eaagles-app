// components/FeedbacksReceived.tsx
import { Card, List, Text } from '@nextui-org/react';

interface Feedback {
  id: number;
  content: string;
  pitchId: number;
  createdAt: string;
}

interface FeedbacksReceivedProps {
  feedbacks: Feedback[];
}

const FeedbacksReceived: React.FC<FeedbacksReceivedProps> = ({ feedbacks }) => {
  return (
    <Card>
      <Card.Body>
        <Text h4>Feedbacks Received</Text>
        <List>
          {feedbacks.map(feedback => (
            <List.Item key={feedback.id}>
              <Text>{feedback.content}</Text>
              <Text size="small" color="gray">{new Date(feedback.createdAt).toLocaleDateString()}</Text>
            </List.Item>
          ))}
        </List>
      </Card.Body>
    </Card>
  );
};

export default FeedbacksReceived;
