"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { v4 as uuidv4 } from "uuid"; // For generating unique file names
import supabase from "@/lib/supabaseClient"; // Adjust this import based on your setup
import { FaCalendarAlt, FaDownload, FaMapMarkerAlt, FaMoneyBillWave, FaVideo } from "react-icons/fa";
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
    updatedAt: new Date().toISOString(),
  });
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [expandedPitchId, setExpandedPitchId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
      console.log('Event received:', data);
    });

    return () => {
      pusher.unsubscribe('my-channel');
    };
  }, []);

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const { data: uploadData, error: uploadError } = await supabase.storage.from('video').upload(path, file);
    if (uploadError) {
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }
    const { data: urlData } = supabase.storage.from('video').getPublicUrl(path);
    if (!urlData?.publicUrl) {
      throw new Error("Failed to get public URL");
    }
    return urlData.publicUrl;
  };

  const handleCreate = async () => {
    setLoading(true); // Start loading
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
        updatedAt: new Date().toISOString(),
      });
      setVideoFile(null);
      setAttachmentFiles([]);
      toast.success("Pitch created successfully");
      setLoading(false); 
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create pitch";
      toast.error(errorMessage);
      setLoading(false); 
    }
  };

  const handleUpdate = async (id: number) => {
    if (!selectedPitch) return;
    setLoading(true); 

    try {
      const response = await fetch(`/api/create-pitch/${selectedPitch.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedPitch),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to update pitch");
      }
      setLoading(false); 
      setSelectedPitch(null);
      setIsEditing(false);
      toast.success("Pitch updated successfully");
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update pitch";
      setSelectedPitch(null);
      setIsEditing(false);
      setLoading(false); 
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true); 
      const response = await fetch(`/api/create-pitch/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete pitch");
      }
      setPitches(pitches.filter((pitch) => pitch.id !== id));
      toast.success("Pitch deleted successfully");
      setLoading(false); 
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete pitch";
      setLoading(false); 
      toast.error(errorMessage);
    }
  };

  const handleViewDetails = (id: number) => {
    setExpandedPitchId(id === expandedPitchId ? null : id);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto py-10">
        <h2 className="text-4xl font-extrabold mb-8 text-center">Pitches Management</h2>
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 border-2 border-gray-800 text-gray-800 rounded-full ${activeTab === "overview" ? "bg-gray-800 text-white" : "bg-transparent"} hover:bg-gray-800 hover:text-white transition-colors duration-300`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-6 py-3 border-2 border-gray-800 text-gray-800 rounded-full ${activeTab === "add" ? "bg-gray-800 text-white" : "bg-transparent"} hover:bg-gray-800 hover:text-white transition-colors duration-300`}
          >
            Add Pitch
          </button>
        </div>
        
        {/* Render based on active tab */}
        {activeTab === "overview" && (
          <div className="p-6 rounded-lg">
            {/* Pitches List */}
            <ul className="space-y-4">
              {pitches.length > 0 ? (
                pitches.map((pitch) => (
                  <li
                    key={pitch.id}
                    className="border dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      {isEditing && selectedPitch?.id === pitch.id ? (
                        // Edit Form
                        <div className="p-6 rounded-lg w-full">
                          <h3 className="text-3xl font-bold mb-6">Edit Pitch</h3>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleUpdate(pitch.id);
                            }}
                            className="space-y-6"
                          >
                            {/* Editable Fields */}
                            <div className="flex flex-col md:flex-row md:space-x-6">
                              <div className="w-full">
                                <label className="block text-gray-700 dark:text-gray-200">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  value={selectedPitch?.title || ""}
                                  onChange={(e) =>
                                    setSelectedPitch({
                                      ...selectedPitch,
                                      title: e.target.value,
                                    })
                                  }
                                  className="border p-2 rounded w-full"
                                  required
                                />
                              </div>
                              <div className="w-full">
                                <label className="block text-gray-700 dark:text-gray-200">
                                  Funding Goal
                                </label>
                                <input
                                  type="number"
                                  value={selectedPitch?.fundingGoal || ""}
                                  onChange={(e) =>
                                    setSelectedPitch({
                                      ...selectedPitch,
                                      fundingGoal: parseFloat(e.target.value),
                                    })
                                  }
                                  className="border p-2 rounded w-full"
                                  required
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-gray-700 dark:text-gray-200">
                                Description
                              </label>
                              <textarea
                                value={selectedPitch?.description || ""}
                                onChange={(e) =>
                                  setSelectedPitch({
                                    ...selectedPitch,
                                    description: e.target.value,
                                  })
                                }
                                className="border p-2 rounded w-full"
                                required
                              />
                            </div>

                            {/* Read-Only Video Section */}
                            <div>
                              <label className="block text-gray-700 dark:text-gray-200">
                                Video (view only)
                              </label>
                              {pitch.videoUrl ? (
                                <div className="mt-2">
                                  <video
                                    src={pitch.videoUrl}
                                    controls
                                    className="w-full max-w-full rounded-lg border border-gray-300 dark:border-gray-700"
                                    style={{ maxHeight: "500px" }}
                                  />
                                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                                    You cannot edit the video. To change it, delete the pitch and create a new one.
                                  </p>
                                </div>
                              ) : (
                                <p className="text-gray-500 dark:text-gray-400">
                                  No video available.
                                </p>
                              )}
                            </div>

                            {/* Read-Only Attachments Section */}
                            <div>
                              <label className="block text-gray-700 dark:text-gray-200">
                                Attachments (view only)
                              </label>
                              {pitch.attachments && pitch.attachments.length > 0 ? (
                                <div className="mt-2">
                                  <ul className="space-y-3">
                                    {pitch.attachments.map((attachment, index) => (
                                      <li
                                        key={index}
                                        className="flex items-center space-x-2"
                                      >
                                        <FaDownload className="text-blue-600" />
                                        <a
                                          href={attachment}
                                          download
                                          className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium transition-colors duration-300"
                                        >
                                          {attachment.split("/").pop()}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                                    You cannot edit the attachments. To change them, delete the pitch and create a new one.
                                  </p>
                                </div>
                              ) : (
                                <p className="text-gray-500 dark:text-gray-400">
                                  No attachments available.
                                </p>
                              )}
                            </div>

                            {/* Save/Cancel Buttons */}
                            <div>
                              <button
                                type="submit"
                                disabled={loading}
                                className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors ${loading ? "cursor-not-allowed" : ""}`}
                              >
                              {loading ? <LoadingDots /> : "Save"}
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
                          <div className="p-6 rounded-lg flex-grow">
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-2">
                              {pitch.title}
                            </h4>
                            <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-wrap items-center">
                              <span className="flex items-center mr-4">
                                <FaCalendarAlt className="mr-1" />
                                Last edited:{" "}
                                {new Date(pitch.updatedAt).toLocaleString()}
                              </span>
                              <span className="flex items-center mr-4">
                                <FaMoneyBillWave className="mr-1" />
                                Funding Goal: R{pitch.fundingGoal?.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4 md:mt-0">
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
                              disabled={loading}
                              className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors  ${loading ? "cursor-not-allowed" : ""}`}
                            >
                             {loading ? <LoadingDots /> : "Delete"}
                            </button>
                            <button
                              onClick={() => handleViewDetails(pitch.id)}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                            >
                              {expandedPitchId === pitch.id
                                ? "Hide Details"
                                : "View Details"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Expandable Details Section */}
                    {expandedPitchId === pitch.id && !isEditing && (
                      <div className="mt-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto rounded-lg">
                        {/* Pitch Details */}
                        <p className="text-gray-900 dark:text-gray-100 text-2xl font-bold mb-4">
                          Details for:{" "}
                          <span className="text-indigo-600">{pitch.title}</span>
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
                          {pitch.description ||
                            "No description provided for this pitch."}
                        </p>

                        {/* Video Section */}
                        {pitch.videoUrl && (
                          <div className="mb-6">
                            <video
                              src={pitch.videoUrl}
                              controls
                              className="w-full max-w-full rounded-lg border border-gray-300 dark:border-gray-700"
                              style={{ maxHeight: "500px" }}
                            />
                            <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center mt-2">
                              <FaVideo className="mr-2" /> Video Preview
                            </p>
                          </div>
                        )}

                        {/* Attachments Section */}
                        {pitch.attachments && pitch.attachments.length > 0 && (
                          <div className="mt-6">
                            <p className="text-gray-900 dark:text-gray-100 text-xl font-semibold mb-3 flex items-center">
                              <FaDownload className="mr-2" /> Attachments:
                            </p>
                            <ul className="space-y-3">
                              {pitch.attachments.map((attachment, index) => (
                                <li
                                  key={index}
                                  className="flex items-center space-x-2"
                                >
                                  <FaDownload className="text-blue-600" />
                                  <a
                                    href={attachment}
                                    download
                                    className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium transition-colors duration-300"
                                  >
                                    {attachment.split("/").pop()}
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
                <p>No pitches available.</p>
              )}
            </ul>
          </div>
        )}
        {activeTab === "add" && (
          <div className="mt-8">
            <h3 className="text-3xl font-bold mb-6">Create New Pitch</h3>
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
              <div className="mb-6">
                <label htmlFor="fundingGoal" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                  Funding Goal (in Rands)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">
                    R
                  </span>
                  <input
                    type="number"
                    id="fundingGoal"
                    name="fundingGoal"
                    value={newPitch.fundingGoal}
                    onChange={(e) => setNewPitch({ ...newPitch, fundingGoal: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter the funding goal"
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700">Video File</label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setVideoFile(file);
                  }}
                  className="border p-2 rounded w-full"
                />
                {videoFile && (
                  <video controls className="mt-2 w-full">
                    <source src={URL.createObjectURL(videoFile)} type={videoFile.type} />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              <div>
                <label className="block text-gray-700">Attachments</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setAttachmentFiles(Array.from(e.target.files || []))}
                  className="border p-2 rounded w-full"
                />
                {attachmentFiles.length > 0 && (
                  <div className="mt-2">
                    {attachmentFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between mb-2">
                        <a href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                          {file.name}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors ${loading ? "cursor-not-allowed" : ""}`}
                >
                  {loading ? <LoadingDots /> : "Create Pitch"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
