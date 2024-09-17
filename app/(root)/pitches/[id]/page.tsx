"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import { FaBuilding, FaDollarSign, FaTag, FaInfoCircle, FaVideo, FaFileDownload, FaCalendarAlt } from "react-icons/fa";
import ReactPlayer from "react-player";

interface Pitch {
  id: number;
  title: string;
  description: string;
  amountRequested: string;
  company: string;
  businessStage: string;
  revenue: string;
  videoUrl?: string;
  pitchDeckFileName?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

const EntrepreneurPitchesPage = () => {
  const { id } = useParams();
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedPitchId, setExpandedPitchId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPitches = async () => {
      if (!id) {
        console.error("User ID is not defined.");
        setError("Invalid user ID.");
        return;
      }

      setLoading(true);
      try {
        console.log(`Fetching pitches for entrepreneur with user ID: ${id}`);

        const response = await axios.get(`/api/opportunities/${id}`);

        if (response.status === 200 && response.data) {
          console.log('Fetched pitches:', response.data);
          setPitches(response.data);
        } else {
          console.error('Invalid response from API:', response);
          throw new Error("Invalid response from API.");
        }
      } catch (err) {
        console.error('Error fetching pitches:', err);
        setError("Failed to fetch pitches");
        toast.error("Failed to fetch pitches");
      } finally {
        setLoading(false);
      }
    };

    fetchPitches();
  }, [id]);

  const handleExpand = (pitch: Pitch) => {
    setExpandedPitchId(expandedPitchId === pitch.id ? null : pitch.id);
  };

  if (loading) return <Loader />;
  if (error) return <EmptyState message={error} />;
  if (pitches.length === 0) return <EmptyState message="No pitches found for this user." />;

  const commonDetails = pitches.length > 0 ? pitches[0] : null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}, ${date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    })}`;
  };

  return (
    <div className="p-6 space-y-6">
      {commonDetails && (
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 border border-blue-200 dark:border-blue-700 rounded-xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <FaBuilding className="text-gray-600 mr-2 text-xl md:text-2xl" />
            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">Company:</h3>
          </div>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-400 mb-4">{commonDetails.company}</p>
          <div className="flex items-center mb-4">
            <FaTag className="text-gray-600 mr-2 text-xl md:text-2xl" />
            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">Business Stage:</h3>
          </div>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-400 mb-4">{commonDetails.businessStage}</p>
          <div className="flex items-center mb-4">
            <FaDollarSign className="text-gray-600 mr-2 text-xl md:text-2xl" />
            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">Amount Requested:</h3>
          </div>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-400 mb-4">{commonDetails.amountRequested}</p>
          <div className="flex items-center mb-4">
            <FaInfoCircle className="text-gray-600 mr-2 text-xl md:text-2xl" />
            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">Revenue:</h3>
          </div>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-400 mb-4">{commonDetails.revenue}</p>
        </div>
      )}

      {pitches.map((pitch) => (
        <div
          key={pitch.id}
          className="bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg"
        >
         <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900 dark:text-gray-100">{pitch.title}</h2>
<p className="text-lg md:text-xl mb-6 text-gray-800 dark:text-gray-300">{pitch.description}</p>

<div className="flex flex-col gap-4">
  <div className="flex items-center">
    <FaCalendarAlt className="text-gray-700 dark:text-gray-200 text-2xl md:text-3xl mr-4" />
    <div>
      <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">Created At:</h3>
      <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">{formatDate(pitch.createdAt)}</p>
    </div>
  </div>

  <div className="flex items-center">
    <FaCalendarAlt className="text-gray-700 dark:text-gray-200 text-2xl md:text-3xl mr-4" />
    <div>
      <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">Last Updated At:</h3>
      <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">{formatDate(pitch.updatedAt)}</p>
    </div>
  </div>
</div>



          <div
            onClick={() => handleExpand(pitch)}
            className="mt-4 cursor-pointer text-green-600 hover:text-green-700 transition-colors"
          >
            {expandedPitchId === pitch.id ? "▲ Show Less" : "▼ View More"}
          </div>

          {expandedPitchId === pitch.id && (
            <div className="bg-gray-200 dark:bg-gray-700 p-6 rounded-xl shadow-lg border-t-2 border-gray-900 dark:border-gray-300 mt-4">
              {pitch.videoUrl && (
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <FaVideo className="text-gray-600 mr-2 text-xl md:text-2xl" />
                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">Video:</h3>
                  </div>
                  <video
                    src={pitch.videoUrl}
                    controls
                    className="w-full max-w-full rounded-lg border border-gray-300 dark:border-gray-700"
                    style={{ maxHeight: '500px' }}
                  >
                      <track 
                        src="captions_en.vtt" 
                        kind="captions" 
                        srcLang="en" 
                        label="English captions"
                        default
                      />
                      Your browser does not support the video tag.
                    </video>
                </div>
              )}
              {pitch.pitchDeckFileName && (
                <div className="flex items-center mb-4">
                  <FaFileDownload className="text-gray-600 mr-2 text-xl md:text-2xl" />
                  <a
                    href={`/api/download/${pitch.pitchDeckFileName}`}
                    download
                    className="text-gray-700 dark:text-gray-400 underline"
                  >
                    Download Pitch Deck
                  </a>
                </div>
              )}
              {pitch.attachments && pitch.attachments.length > 0 && (
                <div className="flex flex-col space-y-2">
                  {pitch.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 dark:text-gray-400 underline"
                    >
                      Attachment {index + 1}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <ToastContainer />
    </div>
  );
};

export default EntrepreneurPitchesPage;
