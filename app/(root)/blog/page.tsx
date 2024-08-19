'use client';
import { title } from "@/components/primitives";
// src/components/EntrepreneurDashboard.tsx
import React,{createContext} from 'react';
import { FaEdit, FaStar, FaDollarSign } from 'react-icons/fa';
import { motion } from 'framer-motion';

const EntrepreneurDashboard: React.FC = () => {
  // Sample data
  const data = {
    profile: {
      bio: 'Passionate entrepreneur with a focus on innovative tech solutions.',
      company: 'Tech Innovators Inc.',
      businessStage: 'Seed Stage',
      fundingHistory: '$500,000 raised from angel investors.'
    },
    startups: [
      {
        id: 1,
        name: 'Startup A',
        description: 'A groundbreaking app for remote collaboration.',
        businessPlanUrl: '#',
        pitchDeckUrl: '#',
        financialProjectionsUrl: '#'
      },
      {
        id: 2,
        name: 'Startup B',
        description: 'Revolutionizing the e-commerce experience.',
        businessPlanUrl: '#',
        pitchDeckUrl: '#',
        financialProjectionsUrl: '#'
      }
    ],
    pitches: [
      {
        id: 1,
        title: 'Pitch for Startup A',
        description: 'An innovative approach to remote work.',
        feedbacks: ['Great idea!', 'Needs more details on market strategy.']
      },
      {
        id: 2,
        title: 'Pitch for Startup B',
        description: 'Disrupting the e-commerce landscape.',
        feedbacks: ['Impressive pitch!', 'Consider focusing on customer acquisition.']
      }
    ],
    investments: [
      {
        id: 1,
        amount: 250000,
        date: '2024-01-15',
        investorProfile: {
          user: {
            name: 'Investor X'
          }
        }
      },
      {
        id: 2,
        amount: 250000,
        date: '2024-03-22',
        investorProfile: {
          user: {
            name: 'Investor Y'
          }
        }
      }
    ],
    notifications: [
      {
        id: 1,
        type: 'Investment Received',
        content: 'You received an investment of $250,000 from Investor X.',
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        type: 'Pitch Feedback',
        content: 'You received feedback on your pitch for Startup A.',
        createdAt: '2024-02-10'
      }
    ]
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Entrepreneur Dashboard</h1>
      </header>

      {/* Profile Section */}
      <motion.section
        className="mb-6 p-6 bg-white rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile Summary</h2>
        <div className="flex flex-col space-y-4">
          <p><strong>Bio:</strong> {data.profile.bio || 'N/A'}</p>
          <p><strong>Company:</strong> {data.profile.company || 'N/A'}</p>
          <p><strong>Business Stage:</strong> {data.profile.businessStage || 'N/A'}</p>
          <p><strong>Funding History:</strong> {data.profile.fundingHistory || 'N/A'}</p>
          <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded flex items-center">
            <FaEdit className="mr-2" /> Edit Profile
          </button>
        </div>
      </motion.section>

      {/* Startups Section */}
      <motion.section
        className="mb-6 p-6 bg-white rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Startups Managed</h2>
        {data.startups.length > 0 ? (
          <ul className="space-y-4">
            {data.startups.map((startup) => (
              <li key={startup.id} className="p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-700">{startup.name}</h3>
                <p>{startup.description || 'No description available.'}</p>
                <a href={startup.businessPlanUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Business Plan</a>
                <a href={startup.pitchDeckUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Pitch Deck</a>
                <a href={startup.financialProjectionsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Financial Projections</a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No startups managed yet.</p>
        )}
      </motion.section>

      {/* Pitches Section */}
      <motion.section
        className="mb-6 p-6 bg-white rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pitches Submitted</h2>
        {data.pitches.length > 0 ? (
          <ul className="space-y-4">
            {data.pitches.map((pitch) => (
              <li key={pitch.id} className="p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-700">{pitch.title}</h3>
                <p>{pitch.description}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="text-yellow-500"><FaStar /></span>
                  <span className="text-gray-600">Feedbacks: {pitch.feedbacks.length}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No pitches submitted yet.</p>
        )}
      </motion.section>

      {/* Investments Section */}
      <motion.section
        className="mb-6 p-6 bg-white rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Investments Received</h2>
        {data.investments.length > 0 ? (
          <ul className="space-y-4">
            {data.investments.map((investment) => (
              <li key={investment.id} className="p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-700">Amount: ${investment.amount.toFixed(2)}</h3>
                <p>Date: {new Date(investment.date).toLocaleDateString()}</p>
                <p>Investor: {investment.investorProfile.user.name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No investments received yet.</p>
        )}
      </motion.section>

      {/* Notifications Section */}
      <motion.section
        className="mb-6 p-6 bg-white rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Notifications</h2>
        {data.notifications.length > 0 ? (
          <ul className="space-y-4">
            {data.notifications.map((notification) => (
              <li key={notification.id} className="p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-700">{notification.type}</h3>
                <p>{notification.content}</p>
                <p className="text-gray-500 text-sm">Received on: {new Date(notification.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No new notifications.</p>
        )}
      </motion.section>
    </div>
  );
};

export default EntrepreneurDashboard;
