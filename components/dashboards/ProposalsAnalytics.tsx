"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Pitch {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

interface Analytics {
  pitchesCount: number;
  investmentsCount: number;
  feedbacksCount: number;
  interestsCount: number;
  pitches: Array<Pitch>;
  investments: Array<{ amount: number; date: string }>;
  feedbacks: Array<{ id: number; content: string; createdAt: string }>;
  interests: Array<{ id: number; createdAt: string }>;
}

export default function ProposalsAnalytics() {
  const [data, setData] = useState<Analytics | null>(null);
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch("/api/analytics");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result.analytics);
      } catch (error) {
        toast.error("Failed to load analytics data");
      }
    }

    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (selectedPitch) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [selectedPitch]);

  const handlePitchClick = (pitch: Pitch) => {
    setSelectedPitch(pitch);
  };

  const handleEdit = () => {
    toast.info("Edit functionality not yet implemented.");
  };

  const handleDelete = () => {
    toast.info("Delete functionality not yet implemented.");
  };

  const handleCloseOverlay = () => {
    setSelectedPitch(null);
  };

  const handleViewAllPitches = () => {
    router.push("/pitches");
  };

  const displayedPitches = data?.pitches.slice(-5) || [];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto py-10">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-yellow-400">
          Pitches Analytics
        </h2>
        {data ? (
          <div className="space-y-8">
            {/* Analytics Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="p-6 rounded-lg shadow-lg border border-gray-700">
                <p className="text-2xl font-semibold">Total Pitches</p>
                <p className="text-4xl font-bold text-gold-500">
                  {data.pitchesCount}
                </p>
              </div>
              <div className="p-6 rounded-lg shadow-lg border border-gray-700">
                <p className="text-2xl font-semibold">Total Investments</p>
                <p className="text-4xl font-bold text-gold-500">
                  {data.investmentsCount}
                </p>
              </div>
              <div className="p-6 rounded-lg shadow-lg border border-gray-700">
                <p className="text-2xl font-semibold">Total Feedbacks</p>
                <p className="text-4xl font-bold text-gold-500">
                  {data.feedbacksCount}
                </p>
              </div>
              <div className="p-6 rounded-lg shadow-lg border border-gray-700">
                <p className="text-2xl font-semibold">Total Interests</p>
                <p className="text-4xl font-bold text-gold-500">
                  {data.interestsCount}
                </p>
              </div>
            </div>

            {/* Detailed Analytics */}
            <div>
              <h3 className="text-3xl font-bold text-center mb-6">
                Detailed Analytics
              </h3>
              <div className="space-y-6">
                {/* Pitches */}
                <div className="p-6 rounded-lg shadow-lg border border-gray-700">
                  <h4 className="text-2xl font-semibold mb-4">Pitches</h4>
                  {displayedPitches.length > 0 ? (
                    <ul className="space-y-2">
                      {displayedPitches.map((pitch) => (
                        <li
                          key={pitch.id}
                          className="text-lg flex justify-between cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 p-2 rounded"
                          role="button"
                          tabIndex={0}
                          onClick={() => handlePitchClick(pitch)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handlePitchClick(pitch);
                          }}
                        >
                          <span>{pitch.title}</span>
                          <span className="text-sm text-gray-400">
                            {new Date(pitch.createdAt).toLocaleDateString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-lg text-gray-400">No pitches found.</p>
                  )}
                  {data.pitches.length > 5 && (
                    <button
                      onClick={handleViewAllPitches}
                      className="mt-4 bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-3 rounded-full shadow-lg hover:from-blue-600 hover:to-blue-800 transition-transform transform hover:scale-105"
                    >
                      View All Pitches
                    </button>
                  )}
                </div>

                {/* Investments */}
                <div className="p-6 rounded-lg shadow-lg border border-gray-700">
                  <h4 className="text-2xl font-semibold mb-4">Investments</h4>
                  {data.investments.length > 0 ? (
                    <ul className="space-y-2">
                      {data.investments.map((investment) => (
                        <li
                          key={investment.date}
                          className="text-lg flex justify-between"
                        >
                          <span>${investment.amount.toLocaleString()}</span>
                          <span className="text-sm text-gray-400">
                            {new Date(investment.date).toLocaleDateString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-lg text-gray-400">
                      No investments found.
                    </p>
                  )}
                </div>

                {/* Feedbacks */}
                <div className="p-6 rounded-lg shadow-lg border border-gray-700">
                  <h4 className="text-2xl font-semibold mb-4">Feedbacks</h4>
                  {data.feedbacks.length > 0 ? (
                    <ul className="space-y-2">
                      {data.feedbacks.map((feedback) => (
                        <li
                          key={feedback.id}
                          className="text-lg flex justify-between"
                        >
                          <span>{feedback.content}</span>
                          <span className="text-sm text-gray-400">
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-lg text-gray-400">No feedbacks found.</p>
                  )}
                </div>

                {/* Interests */}
                <div className="p-6 rounded-lg shadow-lg border border-gray-700">
                  <h4 className="text-2xl font-semibold mb-4">Interests</h4>
                  {data.interests.length > 0 ? (
                    <ul className="space-y-2">
                      {data.interests.map((interest) => (
                        <li
                          key={interest.id}
                          className="text-lg flex justify-between"
                        >
                          <span>Interest ID: {interest.id}</span>
                          <span className="text-sm text-gray-400">
                            {new Date(interest.createdAt).toLocaleDateString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-lg text-gray-400">No interests found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-lg text-center text-gray-400">Loading...</p>
        )}
      </div>

      {/* Overlay for Selected Pitch */}
      {selectedPitch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-2xl font-semibold mb-4">{selectedPitch.title}</h3>
            <p className="text-lg mb-4">{selectedPitch.description}</p>
            <button
              onClick={handleEdit}
              className="mr-4 bg-gradient-to-r from-green-500 to-green-700 px-4 py-2 rounded-lg text-white"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-gradient-to-r from-red-500 to-red-700 px-4 py-2 rounded-lg text-white"
            >
              Delete
            </button>
            <button
              onClick={handleCloseOverlay}
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
