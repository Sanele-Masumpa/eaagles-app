import React, { useState, useEffect } from 'react';

interface EditProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    name?: string;
    email?: string;
    company?: string;
    businessStage?: string;
    fundingHistory?: string;
  };
  onSave: (updatedData: {
    name?: string;
    email?: string;
    company?: string;
    businessStage?: string;
    fundingHistory?: string;
  }) => void;
}

const EditProfilePopup: React.FC<EditProfilePopupProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    company: initialData.company || '',
    businessStage: initialData.businessStage || '',
    fundingHistory: initialData.fundingHistory || '',
  });

  useEffect(() => {
    setFormData({
      name: initialData.name || '',
      email: initialData.email || '',
      company: initialData.company || '',
      businessStage: initialData.businessStage || '',
      fundingHistory: initialData.fundingHistory || '',
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Company:</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Business Stage:</label>
            <input
              type="text"
              name="businessStage"
              value={formData.businessStage}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Funding History:</label>
            <textarea
              name="fundingHistory"
              value={formData.fundingHistory}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-4"
            >
              Cancel
            </button>
            <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePopup;
