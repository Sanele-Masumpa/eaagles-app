"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import Loader from "@/components/Loader";

interface Pitch {
  id: number;
  title: string;
  description: string;
  entrepreneurId: number; // Required field
  category?: string;
  fundingGoal?: number;
  currentFunding?: number;
  stage?: string;
  video?: Uint8Array; // For storing video data
  pitchDeck?: Uint8Array; // For storing pitch deck data
  deadline?: string; // Date as string
  locationId?: number;
  tags: string[];
  status?: string;
  attachments: Uint8Array[]; // For storing attachments
  presentationDate?: string; // Date as string
  createdAt: string;
  updatedAt: string;
}

interface PusherEvent {
  pitch: Pitch;
}

export default function PitchesPage() {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newPitch, setNewPitch] = useState<Omit<Pitch, 'id' | 'createdAt' | 'updatedAt'>>({
    title: "",
    description: "",
    entrepreneurId: 1, // Set a default value or retrieve from user session
    tags: [],
    attachments: [],
  });
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [expandedPitchId, setExpandedPitchId] = useState<number | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPitches() {
      try {
        const response = await fetch("/api/pitches");
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
    channel.bind('update', (data: PusherEvent) => {
      console.log('Event received:', data); // Log data to see if the event is triggered
      // Handle the pitch update
    });
  
    return () => {
      pusher.unsubscribe('my-channel');
    };
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  const handleCreate = async () => {
    try {
      const response = await fetch("/api/pitches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPitch),
      });
      if (!response.ok) {
        throw new Error("Failed to create pitch");
      }
      const result = await response.json();
      setNewPitch({
        title: "",
        description: "",
        entrepreneurId: 1, // Ensure entrepreneurId is included
        tags: [],
        attachments: [],
      });
      setIsCreating(false);
      toast.success("Pitch created successfully");
      window.location.reload();
      router.refresh(); // Refresh the page
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create pitch";
      toast.error(errorMessage);
    }
  };

  const handleUpdate = async () => {
    if (!selectedPitch) return;

    try {
      const response = await fetch(`/api/pitches/${selectedPitch.id}`, {
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
      window.location.reload();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update pitch";
      setSelectedPitch(null);
      setIsEditing(false);
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/pitches/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete pitch");
      }
      setPitches(pitches.filter((pitch) => pitch.id !== id));
      toast.success("Pitch deleted successfully");
      router.refresh(); // Refresh the page
      window.location.reload();
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
    <div className="max-w-full px-6 py-8 mx-auto">
      <div className="max-w-7xl mx-auto py-10">
        <h2 className="text-4xl font-extrabold mb-8 text-center">Pitches Management</h2>

        {/* Create Pitch Button */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setIsCreating(true)}
            className="px-6 py-3 rounded-full shadow-lg bg-gradient-to-r from-green-400 to-green-600 text-white hover:opacity-90 transition-opacity duration-300"
          >
            Add New Pitch
          </button>
        </div>

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
                      <p className="text-sm text-gray-600 dark:text-gray-200">
                        {new Date(pitch.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleViewDetails(pitch.id)}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:opacity-90 transition-opacity duration-300"
                      >
                        {expandedPitchId === pitch.id ? "Hide" : "View"}
                      </button>
                      <button
                        onClick={() => handleEditClick(pitch)}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:opacity-90 transition-opacity duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pitch.id)}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-red-400 to-red-600 text-white hover:opacity-90 transition-opacity duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {expandedPitchId === pitch.id && (
                    <div className="mt-4 p-4 border-t border-gray-200">
                      <h5 className="text-lg font-semibold">Description</h5>
                      <p className="text-gray-800 dark:text-gray-200">{pitch.description}</p>
                      {/* Add more details about the pitch */}
                      {pitch.category && <p><strong>Category:</strong> {pitch.category}</p>}
                      {pitch.fundingGoal && <p><strong>Funding Goal:</strong> ${pitch.fundingGoal.toLocaleString()}</p>}
                      {pitch.currentFunding && <p><strong>Current Funding:</strong> ${pitch.currentFunding.toLocaleString()}</p>}
                      {pitch.stage && <p><strong>Stage:</strong> {pitch.stage}</p>}
                      {pitch.video && <p><strong>Video:</strong> (Video content)</p>}
                      {pitch.pitchDeck && <p><strong>Pitch Deck:</strong> (Pitch Deck content)</p>}
                      {pitch.deadline && <p><strong>Deadline:</strong> {new Date(pitch.deadline).toLocaleDateString()}</p>}
                      {pitch.locationId && <p><strong>Location ID:</strong> {pitch.locationId}</p>}
                      {pitch.tags.length > 0 && <p><strong>Tags:</strong> {pitch.tags.join(", ")}</p>}
                      {pitch.status && <p><strong>Status:</strong> {pitch.status}</p>}
                      {pitch.attachments.length > 0 && <p><strong>Attachments:</strong> (Attachments content)</p>}
                      {pitch.presentationDate && <p><strong>Presentation Date:</strong> {new Date(pitch.presentationDate).toLocaleDateString()}</p>}
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

      {/* Create Pitch Modal */}
      {isCreating && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <h3 className="text-2xl font-semibold mb-4">Create New Pitch</h3>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  value={newPitch.title}
                  onChange={(e) => setNewPitch({ ...newPitch, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  value={newPitch.description}
                  onChange={(e) => setNewPitch({ ...newPitch, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Entrepreneur ID</label>
                <input
                  type="number"
                  value={newPitch.entrepreneurId}
                  onChange={(e) => setNewPitch({ ...newPitch, entrepreneurId: +e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Category</label>
                <input
                  type="text"
                  value={newPitch.category || ""}
                  onChange={(e) => setNewPitch({ ...newPitch, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Funding Goal</label>
                <input
                  type="number"
                  value={newPitch.fundingGoal || ""}
                  onChange={(e) => setNewPitch({ ...newPitch, fundingGoal: +e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Current Funding</label>
                <input
                  type="number"
                  value={newPitch.currentFunding || ""}
                  onChange={(e) => setNewPitch({ ...newPitch, currentFunding: +e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Stage</label>
                <input
                  type="text"
                  value={newPitch.stage || ""}
                  onChange={(e) => setNewPitch({ ...newPitch, stage: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Video</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => e.target.files && setNewPitch({ ...newPitch, video: e.target.files[0] })}
                  className="w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Pitch Deck</label>
                <input
                  type="file"
                  accept=".pdf, .pptx"
                  onChange={(e) => e.target.files && setNewPitch({ ...newPitch, pitchDeck: e.target.files[0] })}
                  className="w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Deadline</label>
                <input
                  type="date"
                  value={newPitch.deadline || ""}
                  onChange={(e) => setNewPitch({ ...newPitch, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Location ID</label>
                <input
                  type="number"
                  value={newPitch.locationId || ""}
                  onChange={(e) => setNewPitch({ ...newPitch, locationId: +e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newPitch.tags.join(", ")}
                  onChange={(e) => setNewPitch({ ...newPitch, tags: e.target.value.split(", ").filter(tag => tag) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Status</label>
                <input
                  type="text"
                  value={newPitch.status || ""}
                  onChange={(e) => setNewPitch({ ...newPitch, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Attachments</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => e.target.files && setNewPitch({ ...newPitch, attachments: Array.from(e.target.files) })}
                  className="w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Presentation Date</label>
                <input
                  type="date"
                  value={newPitch.presentationDate || ""}
                  onChange={(e) => setNewPitch({ ...newPitch, presentationDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleCreate}
                  className="px-6 py-3 rounded-full shadow-lg bg-gradient-to-r from-green-400 to-green-600 text-white hover:opacity-90 transition-opacity duration-300"
                >
                  Create Pitch
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-6 py-3 rounded-full shadow-lg bg-gradient-to-r from-red-400 to-red-600 text-white hover:opacity-90 transition-opacity duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Pitch Modal */}
      {isEditing && selectedPitch && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <h3 className="text-2xl font-semibold mb-4">Edit Pitch</h3>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  value={selectedPitch.title}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  value={selectedPitch.description}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Entrepreneur ID</label>
                <input
                  type="number"
                  value={selectedPitch.entrepreneurId}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, entrepreneurId: +e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Category</label>
                <input
                  type="text"
                  value={selectedPitch.category || ""}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Funding Goal</label>
                <input
                  type="number"
                  value={selectedPitch.fundingGoal || ""}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, fundingGoal: +e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Current Funding</label>
                <input
                  type="number"
                  value={selectedPitch.currentFunding || ""}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, currentFunding: +e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Stage</label>
                <input
                  type="text"
                  value={selectedPitch.stage || ""}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, stage: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Video</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => e.target.files && setSelectedPitch({ ...selectedPitch, video: e.target.files[0] })}
                  className="w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Pitch Deck</label>
                <input
                  type="file"
                  accept=".pdf, .pptx"
                  onChange={(e) => e.target.files && setSelectedPitch({ ...selectedPitch, pitchDeck: e.target.files[0] })}
                  className="w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Deadline</label>
                <input
                  type="date"
                  value={selectedPitch.deadline || ""}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Location ID</label>
                <input
                  type="number"
                  value={selectedPitch.locationId || ""}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, locationId: +e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Tags (comma separated)</label>
                <input
                  type="text"
                  value={selectedPitch.tags.join(", ")}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, tags: e.target.value.split(", ").filter(tag => tag) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Status</label>
                <input
                  type="text"
                  value={selectedPitch.status || ""}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Attachments</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => e.target.files && setSelectedPitch({ ...selectedPitch, attachments: Array.from(e.target.files) })}
                  className="w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Presentation Date</label>
                <input
                  type="date"
                  value={selectedPitch.presentationDate || ""}
                  onChange={(e) => setSelectedPitch({ ...selectedPitch, presentationDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="px-6 py-3 rounded-full shadow-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:opacity-90 transition-opacity duration-300"
                >
                  Update Pitch
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 rounded-full shadow-lg bg-gradient-to-r from-red-400 to-red-600 text-white hover:opacity-90 transition-opacity duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
