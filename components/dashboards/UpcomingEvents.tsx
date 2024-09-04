// components/UpcomingEvents.tsx
import { Card, List, Text } from '@nextui-org/react';

interface Event {
  id: number;
  title: string;
  date: string;
}

const UpcomingEvents: React.FC = () => {
  // Placeholder events data
  const events: Event[] = [
    { id: 1, title: "Investment Summit", date: new Date().toISOString() },
    // Add more events as needed
  ];

  return (
    <Card>
      <Card.Body>
        <Text h4>Upcoming Events</Text>
        <List>
          {events.map(event => (
            <List.Item key={event.id}>
              <Text>{event.title}</Text>
              <Text size="small" color="gray">{new Date(event.date).toLocaleDateString()}</Text>
            </List.Item>
          ))}
        </List>
      </Card.Body>
    </Card>
  );
};

export default UpcomingEvents;
