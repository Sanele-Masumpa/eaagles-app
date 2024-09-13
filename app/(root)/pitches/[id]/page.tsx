"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import { FaBuilding, FaDollarSign, FaTag, FaInfoCircle } from "react-icons/fa";

interface Pitch {
  id: number;
  title: string;
  description: string;
  amountRequested: string;
  company: string;
  businessStage: string;
  revenue: string;
}

const PitchesPage = () => {
  const { userId } = useParams(); // Use useParams to get route parameters
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPitches = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        console.log(`Fetching pitches for user ID: ${userId}`); // Log userId
        const response = await axios.get(`/api/opportunities/${userId}`);
        console.log('Fetched pitches:', response.data); // Log fetched data
        setPitches(response.data);
      } catch (err) {
        console.error('Error fetching pitches:', err);
        setError("Failed to fetch pitches");
        toast.error("Failed to fetch pitches");
      } finally {
        setLoading(false);
      }
    };

    fetchPitches();
  }, [userId]);

  if (loading) return <Loader />;
  if (error) return <EmptyState message={error} />;

  if (pitches.length === 0) return <EmptyState message="No pitches found for this user." />;

  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-3xl font-semibold mb-6">Pitches for User {userId}</h1>
      <div className="space-y-6">
        {pitches.map((pitch) => (
          <div
            key={pitch.id}
            className="bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-4">{pitch.title}</h2>
            <p className="text-base mb-4">{pitch.description}</p>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-t-2 border-gray-900 dark:border-gray-300">
              <div className="flex items-center mb-2">
                <FaBuilding className="text-gray-600 mr-2" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Company:</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-400 mb-2">{pitch.company}</p>
              <div className="flex items-center mb-2">
                <FaTag className="text-gray-600 mr-2" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Business Stage:</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-400 mb-2">{pitch.businessStage}</p>
              <div className="flex items-center mb-2">
                <FaDollarSign className="text-gray-600 mr-2" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Amount Requested:</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-400 mb-2">{pitch.amountRequested}</p>
              <div className="flex items-center mb-2">
                <FaInfoCircle className="text-gray-600 mr-2" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Revenue:</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-400 mb-2">{pitch.revenue}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PitchesPage;
