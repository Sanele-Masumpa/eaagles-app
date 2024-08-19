"use client";
import React, { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@clerk/nextjs";

interface EntrepreneurProfile {
  id: number;
  bio?: string;
  company?: string;
  businessStage?: string;
  fundingHistory?: string;
}

interface EntrepreneurProfileProps {
  data?: EntrepreneurProfile;
  onEdit: (data: EntrepreneurProfile) => void;
}

const businessStages = [
  "Idea",
  "Prototype",
  "Early Stage",
  "Growth",
  "Expansion",
  "Mature",
];

const EntrepreneurProfile: React.FC<EntrepreneurProfileProps> = ({ data, onEdit }) => {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<EntrepreneurProfile>(data || { id: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [isModalOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/entrepreneur-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message || "Profile updated successfully!");
        onEdit(result.profile);
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  return (
    <div className="w-full mx-auto mb-8 p-8">
      <div className="flex items-center space-x-6 mb-8">
        {user?.imageUrl && (
          <img
            src={user.imageUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-gradient-to-r from-blue-500 to-blue-700 shadow-xl"
          />
        )}
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold">{user?.firstName} {user?.lastName}</h2>
          <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-gray-800 dark:text-gray-300">{data?.company || 'N/A'}</p>
        </div>
      </div>

      <div className="p-8 rounded-xl shadow-lg border border-gray-800">
        <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl mb-4">
          <strong className="text-blue-400">Bio:</strong> {data?.bio || "N/A"}
        </p>
        <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl mb-4">
          <strong className="text-blue-400">Company:</strong> {data?.company || "N/A"}
        </p>
        <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl mb-4">
          <strong className="text-blue-400">Business Stage:</strong>{" "}
          <span className="text-gray-400 dark:text-gray-400">{data?.businessStage || "N/A"}</span>
        </p>
        <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl mb-4">
          <strong className="text-blue-400">Funding History:</strong>{" "}
          <span className="text-gray-400 dark:text-gray-400">{data?.fundingHistory || "N/A"}</span>
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-4 rounded-full mt-6 shadow-md hover:from-blue-600 hover:to-blue-800 transition-transform transform hover:scale-105"
        >
          Edit Profile
        </button>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
          onClick={(e) => {
            if (e.target === modalRef.current) {
              setIsModalOpen(false);
            }
          }}
        >
          <div
            ref={modalRef}
            className="bg-gray-300 dark:bg-gray-700 p-8 rounded-xl shadow-2xl w-full max-w-lg border border-gray-800"
          >
            <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-blue-400 mb-6">Edit Entrepreneur Profile</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6">
                <input
                  type="text"
                  name="bio"
                  placeholder="Bio"
                  value={formData.bio || ""}
                  onChange={handleChange}
                  className="border border-gray-700 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  value={formData.company || ""}
                  onChange={handleChange}
                  className="border border-gray-700 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                <select
                  name="businessStage"
                  value={formData.businessStage || ""}
                  onChange={handleChange}
                  className="border border-gray-700 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                  <option value="" disabled>Select Business Stage</option>
                  {businessStages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="fundingHistory"
                  placeholder="Funding History (Read-Only)"
                  value={data?.fundingHistory || ""}
                  readOnly
                  className="border border-gray-700 p-4 rounded-lg"
                />
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-green-700 px-8 py-4 rounded-full shadow-lg hover:from-green-600 hover:to-green-800 transition-transform transform hover:scale-105"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gradient-to-r from-red-500 to-red-700 px-8 py-4 rounded-full shadow-lg hover:from-red-600 hover:to-red-800 transition-transform transform hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default EntrepreneurProfile;
