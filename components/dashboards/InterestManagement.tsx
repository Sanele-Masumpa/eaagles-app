// components/InterestManagement.tsx
import { Card, List, Button, Text } from '@nextui-org/react';

interface Interest {
  id: number;
  pitchId: number;
  createdAt: string;
}

const InterestManagement: React.FC = () => {
  // Placeholder interests data
  const interests: Interest[] = [
    { id: 1, pitchId: 101, createdAt: new Date().toISOString() },
    // Add more interests as needed
  ];

  return (
    <Card>
      <Card.Body>
        <Text h4>Interest Management</Text>
        <List>
          {interests.map(interest => (
            <List.Item key={interest.id}>
              <Text>Pitch ID: {interest.pitchId}</Text>
              <Text size="small" color="gray">{new Date(interest.createdAt).toLocaleDateString()}</Text>
            </List.Item>
          ))}
        </List>
        <Button color="primary">Update Interests</Button>
      </Card.Body>
    </Card>
  );
};

export default InterestManagement;
