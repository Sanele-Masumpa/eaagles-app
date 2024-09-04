"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaUsers, FaPaperPlane, FaCheckCircle, FaTimesCircle, FaTrashAlt, FaSearch } from 'react-icons/fa';
import Loader from '@/components/Loader';
import EmptyState from '@/components/EmptyState';

interface Profile {
  id: number;
  name: string;
  email: string;
  role: string;
  imageUrl: string;
  entrepreneurProfile?: {
    company: string;
    bio: string;
  };
  investorProfile?: {
    investmentStrategy: string;
  };
}

interface FriendRequest {
  id: number;
  senderId: number;
  receiverId: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  sender: Profile;
  receiver: Profile;
}

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'sent' | 'received'>('all');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/users');
        setProfiles(response.data);
      } catch (err) {
        setError('Failed to fetch profiles');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    if (activeTab === 'sent' || activeTab === 'received') {
      const fetchRequests = async () => {
        setLoading(true);
        try {
          const sentResponse = await axios.get('/api/friend-requests/sent');
          const receivedResponse = await axios.get('/api/friend-requests/received');
          setSentRequests(sentResponse.data);
          setReceivedRequests(receivedResponse.data);
        } catch (err) {
          setError('Failed to fetch friend requests');
        } finally {
          setLoading(false);
        }
      };

      fetchRequests();
    }
  }, [activeTab]);

  const sendFriendRequest = async (receiverId: number) => {
    try {
      await axios.post('/api/send-friend-request', { receiverId });
      toast.success('Friend request sent!');
      if (activeTab === 'all') {
        const response = await axios.get('/api/users');
        setProfiles(response.data);
      }
    } catch (err) {
      toast.error('Failed to send friend request');
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await axios.post(`/api/friend-requests/${requestId}/accept`);
      toast.success('Friend request accepted!');
      refreshRequests();
    } catch (err) {
      toast.error('Failed to accept friend request');
    }
  };

  const handleDeclineRequest = async (requestId: number) => {
    try {
      await axios.post(`/api/friend-requests/${requestId}/reject`);
      toast.success('Friend request rejected!');
      refreshRequests();
    } catch (err) {
      toast.error('Failed to reject friend request');
    }
  };

  const handleDeleteRequest = async (requestId: number) => {
    try {
      await axios.delete(`/api/friend-requests/${requestId}/delete`);
      toast.success('Friend request deleted!');
      refreshRequests();
    } catch (err) {
      toast.error('Failed to delete friend request');
    }
  };

  const refreshRequests = async () => {
    if (activeTab === 'sent') {
      const response = await axios.get('/api/friend-requests/sent');
      setSentRequests(response.data);
    } else if (activeTab === 'received') {
      const response = await axios.get('/api/friend-requests/received');
      setReceivedRequests(response.data);
    }
  };

  const filteredProfiles = profiles
    .filter(profile =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(profile =>
      roleFilter ? profile.role === roleFilter : true
    );

  const renderContent = () => {
    if (loading) return <Loader />;

    const dataToDisplay = activeTab === 'all' ? filteredProfiles : (activeTab === 'sent' ? sentRequests : receivedRequests);

    if (dataToDisplay.length === 0) {
      return <EmptyState message={`No ${activeTab} requests`} />;
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex items-center w-1/3">
            <FaSearch className="absolute left-3 text-gray-500 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Search by name, email..."
              className="pl-10 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="py-2 px-4 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Filter by role</option>
            <option value="Entrepreneur">Entrepreneur</option>
            <option value="Investor">Investor</option>
            <option value="Admin">Admin</option>
            {/* Add more roles as needed */}
          </select>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {dataToDisplay.map((item: any) => (
            <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg bg-white dark:bg-gray-800">
              <div className="flex flex-col items-center">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 rounded-full border-4 border-blue-600 shadow-lg object-cover"
                  />
                )}
                <div className="mt-4 text-center">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{item.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{item.email}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Role: <span className="font-semibold">{item.role}</span></p>
                  {item.entrepreneurProfile && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm mb-4">
                      <p className="font-semibold text-gray-800 dark:text-gray-100">Company:</p>
                      <p className="text-gray-700 dark:text-gray-300">{item.entrepreneurProfile.company}</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100 mt-2">Bio:</p>
                      <p className="text-gray-700 dark:text-gray-300">{item.entrepreneurProfile.bio}</p>
                    </div>
                  )}
                  {item.investorProfile && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm mb-4">
                      <p className="font-semibold text-gray-800 dark:text-gray-100">Investment Strategy:</p>
                      <p className="text-gray-700 dark:text-gray-300">{item.investorProfile.investmentStrategy}</p>
                    </div>
                  )}
                  {activeTab === 'all' && (
                    <button
                      onClick={() => sendFriendRequest(item.id)}
                      className="mt-4 bg-green-600 dark:bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 dark:hover:bg-green-400 transition-colors"
                    >
                      <FaPaperPlane className="inline-block mr-2" /> Send Friend Request
                    </button>
                  )}
                  {activeTab === 'received' && item.status === 'PENDING' && (
                    <div className="mt-4 flex justify-center space-x-4">
                      <button
                        onClick={() => handleAcceptRequest(item.id)}
                        className="bg-green-600 dark:bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 dark:hover:bg-green-400 transition-colors"
                      >
                        <FaCheckCircle className="inline-block mr-2" /> Accept
                      </button>
                      <button
                        onClick={() => handleDeclineRequest(item.id)}
                        className="bg-red-600 dark:bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 dark:hover:bg-red-400 transition-colors"
                      >
                        <FaTimesCircle className="inline-block mr-2" /> Decline
                      </button>
                    </div>
                  )}
                  {(activeTab === 'sent' || activeTab === 'received') && (
                    <div className="mt-4 text-gray-600 dark:text-gray-300">
                      <p>Status: 
                        <span className={`font-semibold ${item.status === 'PENDING' ? 'text-yellow-600 dark:text-yellow-500' : item.status === 'ACCEPTED' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                          {item.status}
                        </span>
                      </p>
                    </div>
                  )}
                  {(activeTab === 'sent' || activeTab === 'received') && item.status === 'PENDING' && (
                    <button
                      onClick={() => handleDeleteRequest(item.id)}
                      className="mt-4 bg-gray-600 dark:bg-gray-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 dark:hover:bg-gray-400 transition-colors"
                    >
                      <FaTrashAlt className="inline-block mr-2" /> Delete Request
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2 px-4 rounded-lg ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'} transition-colors`}
        >
          All Profiles
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`py-2 px-4 rounded-lg ${activeTab === 'sent' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'} transition-colors`}
        >
          Sent Requests
        </button>
        <button
          onClick={() => setActiveTab('received')}
          className={`py-2 px-4 rounded-lg ${activeTab === 'received' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'} transition-colors`}
        >
          Received Requests
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default ProfilesPage;
