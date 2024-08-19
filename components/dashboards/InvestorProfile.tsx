import React from 'react';

interface Profile {
  name: string;
  email: string;
  phone: string;
  preferences: string[];
  history: string;
  portfolio: string[];
}

interface InvestorProfileProps {
  profile: Profile;
  onEdit: () => void;
}

const InvestorProfile: React.FC<InvestorProfileProps> = ({ profile, onEdit }) => (
  <div className="w-full max-w-3xl mx-auto mb-8">
    <h2 className="text-2xl font-semibold mb-4">Investor Profile:</h2>
    <div className="p-4 border rounded-lg shadow-md">
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Phone Number:</strong> {profile.phone}</p>
      <p><strong>Investment Preferences:</strong> {profile.preferences.join(', ')}</p>
      <p><strong>Investment History:</strong> {profile.history}</p>
      <p><strong>Current Portfolio:</strong> {profile.portfolio.join(', ')}</p>
      <button onClick={onEdit} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Edit Profile</button>
    </div>
  </div>
);

export default InvestorProfile;
