"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the profile interface
interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  imageUrl: string; // Profile image URL from Clerk
  entrepreneurProfile?: {
    company: string;
    bio: string;
  };
  investorProfile?: {
    investmentStrategy: string;
  };
}

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('/api/users');
        setProfiles(response.data);
      } catch (err) {
        setError('Failed to fetch profiles');
      }
    };

    fetchProfiles();
  }, []);

  const sendFriendRequest = async (receiverId: string) => {
    try {
      await axios.post('/api/send-friend-request', { receiverId });
      toast.success('Friend request sent!');
    } catch (err) {
      toast.error('Failed to send friend request');
    }
  };

  return (
    <div className="p-10 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <ToastContainer />
      {error && <div className="text-red-500 mb-4 text-center text-lg">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {profiles.map(profile => (
          <div key={profile.id} className="relative border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg bg-white dark:bg-gray-800 transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {profile.imageUrl && (
                <img
                  src={profile.imageUrl}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full border-4 border-blue-600 shadow-lg object-cover"
                />
              )}
            </div>
            <div className="mt-16 text-center">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{profile.name}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">{profile.email}</p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">Role: <span className="font-semibold">{profile.role}</span></p>
              {profile.entrepreneurProfile && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm mb-4">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">Company:</p>
                  <p className="text-gray-700 dark:text-gray-300">{profile.entrepreneurProfile.company}</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 mt-2">Bio:</p>
                  <p className="text-gray-700 dark:text-gray-300">{profile.entrepreneurProfile.bio}</p>
                </div>
              )}
              {profile.investorProfile && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm mb-4">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">Investment Strategy:</p>
                  <p className="text-gray-700 dark:text-gray-300">{profile.investorProfile.investmentStrategy}</p>
                </div>
              )}
              <button
                onClick={() => sendFriendRequest(profile.id)}
                className="mt-4 bg-blue-600 dark:bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors transform hover:scale-105"
              >
                Send Friend Request
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilesPage;
