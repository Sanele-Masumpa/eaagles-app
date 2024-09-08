"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { v4 as uuidv4 } from "uuid"; // For generating unique file names
import supabase from "@/lib/supabaseClient"; // Adjust this import based on your setup
import LoadingDots from "@/components/ui/LoadingDots";

interface Pitch {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  videoUrl?: string;
  attachments?: string[];
  category?: string;
  fundingGoal?: number;
  currentFunding?: number;
  stage?: string;
  pitchDeckFileName?: string;
  deadline?: string;
  location: Location;
  tags?: string[];
  status?: string;
  presentationDate?: string;
}

interface Location {
  country: string;
  city?: string; // Allow city to be optional
}

interface PusherEvent {
  pitch: Pitch;
}

export default function PitchesPage() {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newPitch, setNewPitch] = useState<Partial<Pitch>>({
    title: "",
    description: "",
    category: "",
    fundingGoal: undefined,
    currentFunding: undefined,
    stage: "",
    pitchDeckFileName: "",
    deadline: "",
    location: { country: "", city: "" },
    tags: [],
    status: "",
    presentationDate: "",
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [expandedPitchId, setExpandedPitchId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
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

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage.from('video').upload(path, file);
    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
    return data?.path;
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
        category: "",
        fundingGoal: undefined,
        currentFunding: undefined,
        stage: "",
        pitchDeckFileName: "",
        deadline: "",
        location: { country: "", city: "" },
        tags: [],
        status: "",
        presentationDate: "",
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

  const handleUpdate = async () => {
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
                        </div>
                        <div>
                          <button
                            onClick={() => handleEditClick(pitch)}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(pitch.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleViewDetails(pitch.id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-2"
                          >
                            {expandedPitchId === pitch.id ? "Hide Details" : "Show Details"}
                          </button>
                        </div>
                      </div>
                      {expandedPitchId === pitch.id && (
                        <div className="mt-4 text-gray-700">
                          <p><strong>Funding Goal:</strong> ${pitch.fundingGoal}</p>
                          <p><strong>Current Funding:</strong> ${pitch.currentFunding}</p>
                          <p><strong>Stage:</strong> {pitch.stage}</p>
                          <p><strong>Deadline:</strong> {pitch.deadline}</p>
                          <p><strong>Location:</strong> {pitch.location?.city}, {pitch.location?.country}</p>
                          <p><strong>Tags:</strong> {pitch.tags?.join(", ")}</p>
                          <p><strong>Status:</strong> {pitch.status}</p>
                          <p><strong>Presentation Date:</strong> {pitch.presentationDate}</p>
                          {pitch.videoUrl && <video controls src={pitch.videoUrl} className="w-full mt-4" />}
                          {pitch.attachments && pitch.attachments.length > 0 && (
                            <ul className="mt-4">
                              {pitch.attachments.map((attachment, index) => (
                                <li key={index}><a href={attachment} target="_blank" rel="noopener noreferrer" className="text-blue-500">{attachment}</a></li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </li>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No pitches available.</p>
                )}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "add" && (
          <div className="p-6 bg-gray-50 rounded-lg shadow-lg max-w-3xl mx-auto">
          <h3 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Add Your Pitch</h3>
          <div className="space-y-6">
            <div className="flex flex-col">
              <label htmlFor="title" className="text-lg font-semibold mb-2 text-gray-700">Pitch Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter pitch title"
                value={newPitch.title}
                onChange={(e) => setNewPitch({ ...newPitch, title: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
        
            <div className="flex flex-col">
              <label htmlFor="description" className="text-lg font-semibold mb-2 text-gray-700">Description</label>
              <textarea
                id="description"
                placeholder="Describe your pitch"
                value={newPitch.description}
                onChange={(e) => setNewPitch({ ...newPitch, description: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                rows={4}
              />
            </div>
        
            <div className="flex flex-col">
              <label htmlFor="category" className="text-lg font-semibold mb-2 text-gray-700">Category</label>
              <input
                id="category"
                type="text"
                placeholder="Enter category"
                value={newPitch.category}
                onChange={(e) => setNewPitch({ ...newPitch, category: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
        
            <div className="flex flex-col">
              <label htmlFor="fundingGoal" className="text-lg font-semibold mb-2 text-gray-700">Funding Goal ($)</label>
              <input
                id="fundingGoal"
                type="number"
                placeholder="Enter funding goal"
                value={newPitch.fundingGoal || ""}
                onChange={(e) => setNewPitch({ ...newPitch, fundingGoal: Number(e.target.value) })}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
        
            <div className="flex flex-col">
              <label htmlFor="currentFunding" className="text-lg font-semibold mb-2 text-gray-700">Current Funding ($)</label>
              <input
                id="currentFunding"
                type="number"
                placeholder="Enter current funding"
                value={newPitch.currentFunding || ""}
                onChange={(e) => setNewPitch({ ...newPitch, currentFunding: Number(e.target.value) })}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
        
            <div className="flex flex-col">
              <label htmlFor="stage" className="text-lg font-semibold mb-2 text-gray-700">Stage</label>
              <input
                id="stage"
                type="text"
                placeholder="Enter stage"
                value={newPitch.stage}
                onChange={(e) => setNewPitch({ ...newPitch, stage: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
        
            <div className="flex flex-col">
              <label htmlFor="deadline" className="text-lg font-semibold mb-2 text-gray-700">Deadline</label>
              <input
                id="deadline"
                type="date"
                placeholder="Select deadline"
                value={newPitch.deadline}
                onChange={(e) => setNewPitch({ ...newPitch, deadline: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
        
            <div className="flex flex-col">
              <label htmlFor="locationCountry" className="text-lg font-semibold mb-2 text-gray-700">Location Country</label>
              <input
                id="locationCountry"
                type="text"
                placeholder="Enter location country"
                value={newPitch.location?.country || ""}
                onChange={(e) => setNewPitch({ ...newPitch, location: { ...newPitch.location, country: e.target.value } })}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
        
            <div className="flex flex-col">
              <label htmlFor="locationCity" className="text-lg font-semibold mb-2 text-gray-700">Location City</label>
              <input
                id="locationCity"
                type="text"
                placeholder="Enter location city"
                value={newPitch.location?.city || ""}
                onChange={(e) =>
                  setNewPitch({
                    ...newPitch,
                    location: {
                      ...newPitch.location,
                      city: e.target.value || "",
                      country: newPitch.location?.country || "",
                    },
                  })
                }
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
        
            <div className="flex flex-col">
              <label htmlFor="tags" className="text-lg font-semibold mb-2 text-gray-700">Tags (comma-separated)</label>
              <input
                id="tags"
                type="text"
                placeholder="Enter tags"
                value={newPitch.tags?.join(", ") || ""}
                onChange={(e) => setNewPitch({ ...newPitch, tags: e.target.value.split(",").map(tag => tag.trim()) })}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
        
            <div className="flex flex-col">
              <label htmlFor="status" className="text-lg font-semibold mb-2 text-gray-700">Status</label>
              <input
                id="status"
                type="text"
                placeholder="Enter status"
                value={newPitch.status}
                onChange={(e) => setNewPitch({ ...newPitch, status: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
        
            <div className="flex flex-col">
              <label htmlFor="presentationDate" className="text-lg font-semibold mb-2 text-gray-700">Presentation Date</label>
              <input
                id="presentationDate"
                type="date"
                placeholder="Select presentation date"
                value={newPitch.presentationDate}
                onChange={(e) => setNewPitch({ ...newPitch, presentationDate: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
        
            <div className="flex flex-col space-y-2">
              <label htmlFor="videoFile" className="text-lg font-semibold text-gray-700">Upload Video</label>
              <input
                id="videoFile"
                type="file"
                accept="video/*"
                onChange={(e) => e.target.files && setVideoFile(e.target.files[0])}
                className="p-2 border border-gray-300 rounded-lg text-gray-700"
              />
              {videoFile && <span className="text-gray-600">{videoFile.name}</span>}
            </div>
        
            <div className="flex flex-col space-y-2">
              <label htmlFor="attachmentFiles" className="text-lg font-semibold text-gray-700">Upload Attachments</label>
              <input
                id="attachmentFiles"
                type="file"
                accept="application/pdf, application/vnd.ms-excel, application/msword, .ppt, .pptx"
                multiple
                onChange={(e) => e.target.files && setAttachmentFiles(Array.from(e.target.files))}
                className="p-2 border border-gray-300 rounded-lg text-gray-700"
              />
              {attachmentFiles.length > 0 && (
                <ul className="list-disc list-inside text-gray-600">
                  {attachmentFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>
        
            <button
              onClick={handleCreate}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 ease-in-out"
            >
              {isCreating ? <LoadingDots /> : "Create Pitch"}
            </button>
          </div>
        </div>
        
        )}
      </div>

      {/* Overlay */}
      {(selectedPitch || isEditing || isCreating) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <button
              onClick={handleCloseOverlay}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              &times;
            </button>
            {isEditing && selectedPitch && (
              <div>
                <h3 className="text-2xl font-bold mb-4">Edit Pitch</h3>
                <input
                  type="text"
                  placeholder="Title"
                  value={selectedPitch.title}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, title: e.target.value })}
                  className="p-2 border rounded-md w-full mb-4"
                />
                <textarea
                  placeholder="Description"
                  value={selectedPitch.description}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, description: e.target.value })}
                  className="p-2 border rounded-md w-full mb-4"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={selectedPitch.category}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, category: e.target.value })}
                  className="p-2 border rounded-md w-full mb-4"
                />
                <input
                  type="number"
                  placeholder="Funding Goal"
                  value={selectedPitch.fundingGoal || ""}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, fundingGoal: Number(e.target.value) })}
                  className="p-2 border rounded-md w-full mb-4"
                />
                <input
                  type="number"
                  placeholder="Current Funding"
                  value={selectedPitch.currentFunding || ""}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, currentFunding: Number(e.target.value) })}
                  className="p-2 border rounded-md w-full mb-4"
                />
                <input
                  type="text"
                  placeholder="Stage"
                  value={selectedPitch.stage}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, stage: e.target.value })}
                  className="p-2 border rounded-md w-full mb-4"
                />
                <input
                  type="date"
                  placeholder="Deadline"
                  value={selectedPitch.deadline}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, deadline: e.target.value })}
                  className="p-2 border rounded-md w-full mb-4"
                />
                <input
                  type="text"
                  placeholder="Location Country"
                  value={selectedPitch.location?.country || ""}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, location: { ...selectedPitch.location, country: e.target.value } })}
                  className="p-2 border rounded-md w-full mb-4"
                />
                <input
                  type="text"
                  placeholder="Location City"
                  value={selectedPitch.location?.city || ""}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, location: { ...selectedPitch.location, city: e.target.value } })}
                  className="p-2 border rounded-md w-full mb-4"
                />
                <input
                  type="text"
                  placeholder="Tags (comma-separated)"
                  value={selectedPitch.tags?.join(", ") || ""}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, tags: e.target.value.split(",").map(tag => tag.trim()) })}
                  className="p-2 border rounded-md w-full mb-4"
                />
                <input
                  type="text"
                  placeholder="Status"
                  value={selectedPitch.status}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, status: e.target.value })}
                  className="p-2 border rounded-md w-full mb-4"
                />
                <input
                  type="date"
                  placeholder="Presentation Date"
                  value={selectedPitch.presentationDate}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, presentationDate: e.target.value })}
                  className="p-2 border rounded-md w-full mb-4"
                />

                <div className="flex items-center space-x-4 mb-4">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => e.target.files && setVideoFile(e.target.files[0])}
                    className="p-2 border rounded-md"
                  />
                  {videoFile && <span>{videoFile.name}</span>}
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <input
                    type="file"
                    accept="application/pdf, application/vnd.ms-excel, application/msword, .ppt, .pptx"
                    multiple
                    onChange={(e) => e.target.files && setAttachmentFiles(Array.from(e.target.files))}
                    className="p-2 border rounded-md"
                  />
                  {attachmentFiles.length > 0 && (
                    <ul>
                      {attachmentFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  onClick={handleUpdate}
                  className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  {isEditing ? "Updating..." : "Update Pitch"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

