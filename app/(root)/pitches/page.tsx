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
  id: number;
  title: string;
  description: string;
  createdAt: string;
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
          <div>
            {/* Pitches List */}
            <div>
              <h3 className="text-3xl font-bold mb-6">Pitches</h3>
              <ul className="space-y-4">
                {pitches.length > 0 ? (
                  pitches.map((pitch) => (
                    <li key={pitch.id} className="border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-xl font-semibold">{pitch.title}</h4>
                          <p className="text-gray-600">{pitch.description}</p>
                          <p className="text-gray-500">Funding Goal: ${pitch.fundingGoal?.toFixed(2)}</p>
                          <p className="text-gray-500">Current Funding: ${pitch.currentFunding?.toFixed(2)}</p>
                          <p className="text-gray-500">Stage: {pitch.stage || "N/A"}</p>
                          <p className="text-gray-500">Location: {pitch.city}, {pitch.country}</p>
                          <p className="text-gray-500">Status: {pitch.status || "N/A"}</p>
                        </div>
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
                      </div>
                      {expandedPitchId === pitch.id && (
                        <div className="mt-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                        <p className="text-gray-900 text-2xl font-bold mb-4">
                          Details for: <span className="text-indigo-600">{pitch.title}</span>
                        </p>
                        
                        
                  
                        {pitch.videoUrl && (
                          <div className="mb-6">
                            <video 
                              src={pitch.videoUrl} 
                              controls 
                              className="w-full max-w-full rounded-lg border border-gray-300"
                              style={{ maxHeight: '500px' }}
                            />
                            <p className="text-gray-600 text-sm flex items-center mt-2">
                              <FaVideo className="mr-2" /> Video Preview
                            </p>
                          </div>
                        )}
                        
                        {pitch.attachments && pitch.attachments.length > 0 && (
                          <div className="mt-6">
                            <p className="text-gray-900 text-xl font-semibold mb-3 flex items-center">
                              <FaDownload className="mr-2" /> Attachments:
                            </p>
                            <ul className="space-y-3">
                              {pitch.attachments.map((attachment, index) => (
                                <li key={index} className="flex items-center space-x-2">
                                  <FaDownload className="text-blue-600" />
                                  <a 
                                    href={attachment} 
                                    download
                                    className="text-blue-700 hover:text-blue-900 font-medium transition-colors duration-300"
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
                  <p>No pitches available.</p>
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

        {/* Edit Form */}
        {isEditing && selectedPitch && (
          <div className="mt-8 border p-6 rounded-lg shadow-sm">
            <h3 className="text-3xl font-bold mb-6">Edit Pitch</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(selectedPitch.id);
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  value={selectedPitch.title}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, title: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Description</label>
                <textarea
                  value={selectedPitch.description}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, description: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Funding Goal</label>
                <input
                  type="number"
                  value={selectedPitch.fundingGoal || ""}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, fundingGoal: parseFloat(e.target.value) })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Current Funding</label>
                <input
                  type="number"
                  value={selectedPitch.currentFunding || ""}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, currentFunding: parseFloat(e.target.value) })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Stage</label>
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
                <label className="block text-gray-700">Country</label>
                <input
                  type="text"
                  value={selectedPitch.country}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, country: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">City</label>
                <input
                  type="text"
                  value={selectedPitch.city}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, city: e.target.value })}
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
        )}
      </div>
    </div>
  );
};


