'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify'; // Importing toast
import 'react-toastify/dist/ReactToastify.css'; // Importing default styles

const ProposalForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    fundingGoal: '',
    currentFunding: '',
    stage: '',
    status: '',
    presentationDate: '',
    video: null,
    pitchDeck: null,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : null,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        toast.success("Proposal submitted successfully!");
      } else {
        toast.error("Failed to submit proposal");
      }
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast.error("An error occurred while submitting the proposal");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Submit Proposal</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="fundingGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Funding Goal
          </label>
          <input
            type="number"
            id="fundingGoal"
            name="fundingGoal"
            value={formData.fundingGoal}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="currentFunding" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Current Funding
          </label>
          <input
            type="number"
            id="currentFunding"
            name="currentFunding"
            value={formData.currentFunding}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="stage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Stage
          </label>
          <input
            type="text"
            id="stage"
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <input
            type="text"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="presentationDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Presentation Date
          </label>
          <input
            type="date"
            id="presentationDate"
            name="presentationDate"
            value={formData.presentationDate}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="video" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Video (optional)
          </label>
          <input
            type="file"
            id="video"
            name="video"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-300"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="pitchDeck" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Pitch Deck (optional)
          </label>
          <input
            type="file"
            id="pitchDeck"
            name="pitchDeck"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-300"
          />
        </div>

        <button
          type="submit"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Submit Proposal
        </button>
      </form>
    </div>
  );
};

export default ProposalForm;
