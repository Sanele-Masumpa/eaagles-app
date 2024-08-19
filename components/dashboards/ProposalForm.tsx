"use client";

import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProposalFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  fundingGoal: string;
  currentFunding: string;
  stage: string;
  video: File | null;
  pitchDeck: File | null;
  deadline: string;
  location: string;
  tags: string;
  attachments: File[];
  presentationDate: string;
  [key: string]: string | File | File[] | null; // Index signature to handle dynamic properties
}

const ProposalForm: React.FC<ProposalFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    fundingGoal: '',
    currentFunding: '',
    stage: '',
    video: null,
    pitchDeck: null,
    deadline: '',
    location: '', // Combine country and city into a single string
    tags: '',
    attachments: [],
    presentationDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      if (name === 'video') {
        setFormData(prevFormData => ({ ...prevFormData, video: files[0] }));
      } else if (name === 'pitchDeck') {
        setFormData(prevFormData => ({ ...prevFormData, pitchDeck: files[0] }));
      } else if (name === 'attachments') {
        setFormData(prevFormData => ({ ...prevFormData, attachments: Array.from(files) }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      const value = formData[key as keyof FormData];
      if (key === 'video' || key === 'pitchDeck') {
        if (value) formDataToSend.append(key, value as Blob);
      } else if (key === 'attachments') {
        (value as File[]).forEach((file: File) => {
          formDataToSend.append('attachments', file);
        });
      } else if (typeof value === 'string') {
        formDataToSend.append(key, value);
      }
    });

    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || 'Proposal created successfully!');
        setFormData({
          title: '',
          description: '',
          category: '',
          fundingGoal: '',
          currentFunding: '',
          stage: '',
          video: null,
          pitchDeck: null,
          deadline: '',
          location: '',
          tags: '',
          attachments: [],
          presentationDate: ''
        }); // Clear form
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create proposal');
      }
    } catch (error) {
      toast.error('Failed to create proposal');
      console.error(error);
    }
  };

  return (
    <div className="w-full mx-auto mb-8 p-8">
      <h2 className="text-4xl font-extrabold text-blue-400 mb-8">Create New Pitch</h2>
      <form onSubmit={handleSubmit} className="p-8 dark:bg-black rounded-xl shadow-lg">
        <div className="grid grid-cols-1 gap-6">
          <label>
            Pitch Title
            <input
              type="text"
              name="title"
              placeholder="Pitch Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="border border-gray-700 dark:bg-black p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </label>
          <label>
            Pitch Description
            <textarea
              name="description"
              placeholder="Pitch Description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              className="border dark:bg-black border-gray-700 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </label>
          <label>
            Category
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="border border-gray-700 dark:bg-black p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </label>
          <label>
            Funding Goal
            <input
              type="number"
              name="fundingGoal"
              placeholder="Funding Goal"
              value={formData.fundingGoal}
              onChange={handleChange}
              className="border border-gray-700 dark:bg-black p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </label>
          <label>
            Current Funding
            <input
              type="number"
              name="currentFunding"
              placeholder="Current Funding"
              value={formData.currentFunding}
              onChange={handleChange}
              className="border border-gray-700 dark:bg-black p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </label>
          <label>
            Stage
            <input
              type="text"
              name="stage"
              placeholder="Stage"
              value={formData.stage}
              onChange={handleChange}
              className="border border-gray-700 dark:bg-black p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </label>
          <label>
            Deadline
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="border border-gray-700 dark:bg-black p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </label>
          <label>
            Location (Country, City)
            <input
              type="text"
              name="location"
              placeholder="Location (Country, City)"
              value={formData.location}
              onChange={handleChange}
              className="border border-gray-700 dark:bg-black p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </label>
          <label>
            Tags
            <input
              type="text"
              name="tags"
              placeholder="Tags (comma separated)"
              value={formData.tags}
              onChange={handleChange}
              className="border border-gray-700 dark:bg-black p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </label>
          <label>
            Presentation Date
            <input
              type="date"
              name="presentationDate"
              value={formData.presentationDate}
              onChange={handleChange}
              className="border border-gray-700 dark:bg-black p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </label>
          <label>
            Video (Optional)
            <input
              type="file"
              name="video"
              accept="video/*"
              onChange={handleFileChange}
              className="border border-gray-700 dark:bg-black p-4 rounded-lg"
            />
          </label>
          <label>
            Pitch Deck (Optional)
            <input
              type="file"
              name="pitchDeck"
              accept=".pdf,.ppt,.pptx"
              onChange={handleFileChange}
              className="border border-gray-700 dark:bg-black p-4 rounded-lg"
            />
          </label>
          <label>
            Attachments (Optional)
            <input
              type="file"
              name="attachments"
              multiple
              onChange={handleFileChange}
              className="border border-gray-700 dark:bg-black p-4 rounded-lg"
            />
          </label>
        </div>
        <button type="submit" className="bg-blue-400 text-white p-4 rounded-lg mt-4">
          Create Pitch
        </button>
      </form>
    </div>
  );
};

export default ProposalForm;

