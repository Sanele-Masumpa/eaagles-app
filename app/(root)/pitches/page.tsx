"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { v4 as uuidv4 } from "uuid"; // For generating unique file names
import supabase from "@/lib/supabaseClient"; // Adjust this import based on your setup
import { FaDownload, FaVideo } from "react-icons/fa";
import LoadingDots from "@/components/ui/LoadingDots";

interface Pitch {
  updatedAt: string; // Using string for ISO date format
  id: number;
  title: string;
  description: string;
  createdAt: string; // Using string for ISO date format
  videoUrl?: string;
  attachments?: string[];
  fundingGoal?: number;
  currentFunding?: number;
  stage?: string;
  pitchDeckFileName?: string;
  status?: string;
  country: string;
  city: string;
}


interface PusherEvent {
  pitch: Pitch;
}

export default function PitchesPage() {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newPitch, setNewPitch] = useState<Omit<Pitch, 'id' | 'createdAt'> & { videoFile?: File; pitchDeckFile?: File }>({
    title: "",
    description: "",
    fundingGoal: undefined,
    currentFunding: undefined,
    stage: "",
    pitchDeckFileName: "",
    status: "",
    country: "",
    city: "",
    updatedAt: new Date().toISOString(), // Sets current date and time
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [expandedPitchId, setExpandedPitchId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchPitches() {
      try {
        const response = await fetch("/api/create-pitch");
        if (!response.ok) {
          throw new Error("Failed to load pitches");
        }
        const result = await response.json();
        setPitches(result.pitches);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to load pitches";
        toast.error(errorMessage);
      }
    }

    fetchPitches();
  }, []);

  
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe('my-channel');
    channel.bind('update', (data: any) => {
      console.log('Event received:', data); // Log data to see if the event is triggered
    });

    return () => {
      pusher.unsubscribe('my-channel');
    };
  }, []);

  const uploadFile = async (file: File, path: string): Promise<string> => {
    // Upload the file
    const { data: uploadData, error: uploadError } = await supabase.storage.from('video').upload(path, file);
    if (uploadError) {
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }
  
    // Get the public URL of the uploaded file
    const { data: urlData } = supabase.storage.from('video').getPublicUrl(path);
    
    if (!urlData?.publicUrl) {
      throw new Error("Failed to get public URL");
    }
  
    return urlData.publicUrl; // Correctly access the public URL from `data`
  };
  
  
  const handleCreate = async () => {
    try {
      let videoUrl = "";
      if (videoFile) {
        const videoPath = `videos/${uuidv4()}_${videoFile.name}`;
        videoUrl = await uploadFile(videoFile, videoPath);
      }
  
      const attachmentUrls: string[] = [];
      for (const file of attachmentFiles) {
        const attachmentPath = `attachments/${uuidv4()}_${file.name}`;
        const attachmentUrl = await uploadFile(file, attachmentPath);
        attachmentUrls.push(attachmentUrl);
      }
  
      const response = await fetch("/api/create-pitch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newPitch, videoUrl, attachments: attachmentUrls }),
      });
      if (!response.ok) {
        throw new Error("Failed to create pitch");
      }
      const result = await response.json();
      setNewPitch({
        title: "",
        description: "",
        fundingGoal: undefined,
        currentFunding: undefined,
        stage: "",
        status: "",
        country: "",
        city: "",
        updatedAt: new Date().toISOString(), // Sets current date and time
      });
      setVideoFile(null);
      setAttachmentFiles([]);
      toast.success("Pitch created successfully");
      router.refresh(); // Refresh the page
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create pitch";
      toast.error(errorMessage);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!selectedPitch) return;

    try {
      const response = await fetch(`/api/create-pitch/${selectedPitch.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedPitch),
      });

      if (!response.ok) {
        const errorMessage = await response.text(); // Get error message from the response
        throw new Error(errorMessage || "Failed to update pitch");
      }

      setSelectedPitch(null);
      setIsEditing(false);
      toast.success("Pitch updated successfully");
      router.refresh(); // Refresh the page
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update pitch";
      setSelectedPitch(null);
      setIsEditing(false);
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/create-pitch/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete pitch");
      }
      setPitches(pitches.filter((pitch) => pitch.id !== id));
      toast.success("Pitch deleted successfully");
      router.refresh(); // Refresh the page
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete pitch";
      toast.error(errorMessage);
    }
  };

  const handleEditClick = (pitch: Pitch) => {
    setSelectedPitch(pitch);
    setIsEditing(true);
  };

  const handleViewDetails = (id: number) => {
    setExpandedPitchId(id === expandedPitchId ? null : id);
  };

  const handleCloseOverlay = () => {
    setSelectedPitch(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  function handleChange(event: ChangeEvent<HTMLSelectElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto py-10">
        <h2 className="text-4xl font-extrabold mb-8 text-center">Pitches Management</h2>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 rounded-full ${activeTab === "overview" ? "bg-green-600 text-white" : "bg-gray-300 text-gray-800"} hover:opacity-90 transition-opacity duration-300`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-6 py-3 rounded-full ${activeTab === "add" ? "bg-green-600 text-white" : "bg-gray-300 text-gray-800"} hover:opacity-90 transition-opacity duration-300`}
          >
            Add Pitch
          </button>
        </div>

        {/* Render based on active tab */}
        {activeTab === "overview" && (
          <div className="p-6 rounded-lg">
          {/* Pitches List */}
          <div>
            <h3 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Pitches</h3>
            <ul className="space-y-4">
            {pitches.length > 0 ? (
  pitches.map((pitch) => (
    <li key={pitch.id} className="border dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
      <div className="flex justify-between items-center">
        {isEditing && selectedPitch?.id === pitch.id ? (
          <div className="w-full">
            {/* Close Button */}
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-500 dark:text-red-400 absolute top-2 right-4 hover:text-gray-800"
            >
              &#10005; {/* X icon */}
            </button>
            <h3 className="text-3xl font-bold mb-6">Edit Pitch</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(selectedPitch.id);
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Title</label>
                <input
                  type="text"
                  value={selectedPitch.title}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, title: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Description</label>
                <textarea
                  value={selectedPitch.description}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, description: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Funding Goal</label>
                <input
                  type="number"
                  value={selectedPitch.fundingGoal || ""}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, fundingGoal: parseFloat(e.target.value) })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Current Funding</label>
                <input
                  type="number"
                  value={selectedPitch.currentFunding || ""}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, currentFunding: parseFloat(e.target.value) })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Stage</label>
                <select
                  value={selectedPitch.stage}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, stage: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                >
                  <option value="">Select Stage</option>
                  <option value="Idea">Idea</option>
                  <option value="Prototype">Prototype</option>
                  <option value="MVP">MVP</option>
                  <option value="Growth">Growth</option>
                  <option value="Scaling">Scaling</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Country</label>
                <input
                  type="text"
                  value={selectedPitch.country}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, country: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">City</label>
                <input
                  type="text"
                  value={selectedPitch.city}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, city: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Video File</label>
                <input
                  type="file"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Attachments</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setAttachmentFiles(Array.from(e.target.files || []))}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded ml-4 hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0l8-8m-4 4v8m-4-4H4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-200">{pitch.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Last edited on: {new Date(pitch.updatedAt).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                      hour12: true
                    })}
                  </p>
                </div>
              </div>

              {/* Key Info Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0l8-8m-4 4v8m-4-4H4" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400">Funding Goal: R{pitch.fundingGoal?.toFixed(2)}</p>
                </div>

                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16M4 8h16M4 12h16m-7 4h7M4 16h7" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400">Current Funding: R{pitch.currentFunding?.toFixed(2)}</p>
                </div>

                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12m-12 0L18 6" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400">Status: {pitch.status || "N/A"}</p>
                </div>

                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 19.071L4 20.192l1.414 1.414L6.535 20.6M15 12V3l3 3M6 3l3 3M3 12h18M3 15v6h18v-6" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400">Location: {pitch.city}, {pitch.country}</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedPitch(pitch);
                  setIsEditing(true);
                }}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(pitch.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => handleViewDetails(pitch.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                {expandedPitchId === pitch.id ? "Hide Details" : "View Details"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Expandable Details Section */}
      {expandedPitchId === pitch.id && !isEditing && (
        <div className="mt-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto rounded-lg">
          <p className="text-gray-900 dark:text-gray-100 text-2xl font-bold mb-4">
            Details for: <span className="text-indigo-600">{pitch.title}</span>
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
            {pitch.description || "No description provided for this pitch."}
          </p>

          {pitch.videoUrl && (
            <div className="mb-6">
              <video
                src={pitch.videoUrl}
                controls
                className="w-full max-w-full rounded-lg border border-gray-300 dark:border-gray-700"
                style={{ maxHeight: '500px' }}
              />
              <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center mt-2">
                <FaVideo className="mr-2" /> Video Preview
              </p>
            </div>
          )}

          {pitch.attachments && pitch.attachments.length > 0 && (
            <div className="mt-6">
              <p className="text-gray-900 dark:text-gray-100 text-xl font-semibold mb-3 flex items-center">
                <FaDownload className="mr-2" /> Attachments:
              </p>
              <ul className="space-y-3">
                {pitch.attachments.map((attachment, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <FaDownload className="text-blue-600" />
                    <a
                      href={attachment}
                      download
                      className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium transition-colors duration-300"
                    >
                      {attachment.split('/').pop()}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </li>
  ))
) : (
  <p className="text-gray-500 dark:text-gray-400">No pitches available.</p>
)}


            </ul>
          </div>
        </div>
        
        
        )}

        {activeTab === "add" && (
          <div className="mt-8">
            <h3 className="text-3xl font-bold mb-6">Add New Pitch</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  value={newPitch.title}
                  onChange={(e) => setNewPitch({ ...newPitch, title: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Description</label>
                <textarea
                  value={newPitch.description}
                  onChange={(e) => setNewPitch({ ...newPitch, description: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Funding Goal</label>
                <input
                  type="number"
                  value={newPitch.fundingGoal || ""}
                  onChange={(e) => setNewPitch({ ...newPitch, fundingGoal: parseFloat(e.target.value) })}
                  className="border p-2 rounded w-full"
                  required
                />

              </div>
              <div>
                <label className="block text-gray-700">Current Funding</label>
                <input
                  type="number"
                  value={newPitch.currentFunding || ""}
                  onChange={(e) => setNewPitch({ ...newPitch, currentFunding: parseFloat(e.target.value) })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Stage</label>
                <select
                  name="stage" 
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                >
                  <option value="">Select Stage</option>
                  <option value="Idea">Idea</option>
                  <option value="Prototype">Prototype</option>
                  <option value="MVP">MVP</option>
                  <option value="Growth">Growth</option>
                  <option value="Scaling">Scaling</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Country</label>
                <input
                  type="text"
                  value={newPitch.country}
                  onChange={(e) => setNewPitch({ ...newPitch, country: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">City</label>
                <input
                  type="text"
                  value={newPitch.city}
                  onChange={(e) => setNewPitch({ ...newPitch, city: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Video File</label>
                <input
                  type="file"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Attachments</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setAttachmentFiles(Array.from(e.target.files || []))}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Create Pitch
                </button>
              </div>
            </form>
          </div>
        )}

       
      </div>
    </div>
  );
};


