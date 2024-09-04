// components/ProfileOverview.tsx
import { Card, Text } from '@nextui-org/react';
import { useUser } from '@clerk/nextjs';

const ProfileOverview: React.FC = () => {
  const { user } = useUser();
  
  return (
    <Card>
      <Card.Body>
        <Text h4>Profile Overview</Text>
        <Text>Name: {user?.fullName}</Text>
        <Text>Email: {user?.emailAddress}</Text>
        <Text>LinkedIn: {user?.profile?.linkedinUrl || 'N/A'}</Text>
        {/* Add more profile details as needed */}
      </Card.Body>
    </Card>
  );
};

export default ProfileOverview;
