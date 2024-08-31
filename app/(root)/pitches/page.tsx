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
  createdAt: string;
}

interface PusherEvent {
  pitch: Pitch;
}

export default function PitchesPage() {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newPitch, setNewPitch] = useState<{ title: string; description: string }>({
    title: "",
    description: "",
  });
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [expandedPitchId, setExpandedPitchId] = useState<number | null>(null);
  const router = useRouter();
  const [loading,setLoading] = useState(true);
  

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
    channel.bind('update', (data: any) => {
      console.log('Event received:', data); // Log data to see if the event is triggered
    });
  
    return () => {
      pusher.unsubscribe('my-channel');
    };
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  if (loading) {
    return < Loader />;
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
      setNewPitch({ title: "", description: "" });
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
                    </div>
                  )}
                </li>
              ))
            ) : (
              <p className="text-lg text-gray-400">No pitches available.</p>
            )}
          </ul>
        </div>
      </div>

      {/* Create Pitch Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-100 dark:bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Create New Pitch</h3>
            <input
              type="text"
              placeholder="Title"
              value={newPitch.title}
              onChange={(e) => setNewPitch({ ...newPitch, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <textarea
              placeholder="Description"
              value={newPitch.description}
              onChange={(e) => setNewPitch({ ...newPitch, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              rows={4}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white hover:opacity-90 transition-opacity duration-300"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-full bg-gray-300 text-gray-800 hover:opacity-90 transition-opacity duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Pitch Modal */}
      {isEditing && selectedPitch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Edit Pitch</h3>
            <input
              type="text"
              value={selectedPitch.title}
              onChange={(e) =>
                setSelectedPitch({ ...selectedPitch, title: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <textarea
              value={selectedPitch.description}
              onChange={(e) =>
                setSelectedPitch({ ...selectedPitch, description: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded mb-4"
              rows={4}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:opacity-90 transition-opacity duration-300"
              >
                Update
              </button>
              <button
                onClick={handleCloseOverlay}
                className="px-4 py-2 rounded-full bg-gray-300 text-gray-800 hover:opacity-90 transition-opacity duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
