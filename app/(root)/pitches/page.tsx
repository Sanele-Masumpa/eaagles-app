"use client";

import { useState } from 'react';
import { FaUpload, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import supabase  from '@/lib/supabaseClient'; // Adjust path as needed

interface InvestmentOpportunity {
  title: string;
  description?: string;
  amount?: number;
}

const EntrepreneurProfileForm = () => {
  const [bio, setBio] = useState('');
  const [company, setCompany] = useState('');
  const [businessStage, setBusinessStage] = useState('');
  const [fundingHistory, setFundingHistory] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [revenue, setRevenue] = useState<number | ''>('');
  const [investmentOpportunities, setInvestmentOpportunities] = useState<InvestmentOpportunity[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);


const handleFormSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  if (!bio || !company || !businessStage || !fundingHistory || !linkedinUrl || revenue === '') {
    toast.error('All fields are required!');
    return;
  }

  let imageUrl: string | null = null;

  // Upload image to Supabase if an image is selected
  if (image) {
    const { data, error } = await supabase
      .storage
      .from('your-bucket-name') // Replace with your bucket name
      .upload(`profiles/${Date.now()}_${image.name}`, image);

    if (error) {
      toast.error('Failed to upload image.');
      return;
    }
    imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.path}`;
  }

  // Save profile data to Prisma
  try {
    const response = await fetch('/api/entrepreneur-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bio,
        company,
        businessStage,
        fundingHistory,
        linkedinUrl,
        revenue,
        investmentOpportunities,
        imageUrl, // Include image URL if uploaded
      }),
    });

    if (response.ok) {
      toast.success('Profile updated successfully!');
      // Reset the form state
      setBio('');
      setCompany('');
      setBusinessStage('');
      setFundingHistory('');
      setLinkedinUrl('');
      setRevenue('');
      setInvestmentOpportunities([]);
      setImage(null);
      setImagePreview(null);
    } else {
      const errorData = await response.json();
      toast.error(`Failed to update profile: ${errorData.error}`);
    }
  } catch (error) {
    toast.error('Failed to update profile.');
  }
};


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInvestmentOpportunityChange = (index: number, field: keyof InvestmentOpportunity, value: string) => {
    const newOpportunities = [...investmentOpportunities];
    newOpportunities[index] = {
      ...newOpportunities[index],
      [field]: field === 'amount' ? parseFloat(value) : value,
    };
    setInvestmentOpportunities(newOpportunities);
  };

  const addInvestmentOpportunity = () => {
    setInvestmentOpportunities([...investmentOpportunities, { title: '' }]);
  };

  const removeInvestmentOpportunity = (index: number) => {
    setInvestmentOpportunities(investmentOpportunities.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Update Entrepreneur Profile</h2>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="company">Company</label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="businessStage">Business Stage</label>
          <select
            id="businessStage"
            value={businessStage}
            onChange={(e) => setBusinessStage(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          >
            <option value="" disabled>Select Business Stage</option>
            <option value="Startup">Startup</option>
            <option value="Growth">Growth</option>
            <option value="Mature">Mature</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="fundingHistory">Funding History</label>
          <textarea
            id="fundingHistory"
            value={fundingHistory}
            onChange={(e) => setFundingHistory(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="linkedinUrl">LinkedIn URL</label>
          <input
            id="linkedinUrl"
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="revenue">Revenue</label>
          <input
            id="revenue"
            type="number"
            value={revenue}
            onChange={(e) => setRevenue(e.target.valueAsNumber || '')}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="investmentOpportunities">Investment Opportunities</label>
          {investmentOpportunities.map((opportunity, index) => (
            <div key={index} className="flex items-start mb-4 space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Title"
                  value={opportunity.title}
                  onChange={(e) => handleInvestmentOpportunityChange(index, 'title', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm mb-2"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={opportunity.description || ''}
                  onChange={(e) => handleInvestmentOpportunityChange(index, 'description', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm mb-2"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={opportunity.amount || ''}
                  onChange={(e) => handleInvestmentOpportunityChange(index, 'amount', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm mb-2"
                />
              </div>
              <button
                type="button"
                onClick={() => removeInvestmentOpportunity(index)}
                className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <FaTimesCircle />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addInvestmentOpportunity}
            className="flex items-center space-x-2 text-green-600 hover:text-green-800"
          >
            <FaUpload />
            <span>Add Opportunity</span>
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="image">Profile Image</label>
          {imagePreview && (
            <div className="mb-4">
              <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-full" />
            </div>
          )}
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition-colors duration-300"
        >
          Update Profile
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EntrepreneurProfileForm;
