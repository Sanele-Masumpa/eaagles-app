"use client";
import { useState } from 'react';
import { FaUpload, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!bio || !company || !businessStage || !fundingHistory || !linkedinUrl || revenue === '') {
      toast.error('All fields are required!');
      return;
    }

    const formData = new FormData();
    formData.append('bio', bio);
    formData.append('company', company);
    formData.append('businessStage', businessStage);
    formData.append('fundingHistory', fundingHistory);
    formData.append('linkedinUrl', linkedinUrl);
    formData.append('revenue', revenue.toString());
    formData.append('investmentOpportunities', JSON.stringify(investmentOpportunities));
    if (image) formData.append('image', image);

    try {
      const response = await fetch('/api/entrepreneur-profile', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Profile updated successfully!');
        setBio('');
        setCompany('');
        setBusinessStage('');
        setFundingHistory('');
        setLinkedinUrl('');
        setRevenue('');
        setInvestmentOpportunities([]);
        setImage(null);
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
          <input
            id="businessStage"
            type="text"
            value={businessStage}
            onChange={(e) => setBusinessStage(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
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
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-medium file:bg-gray-50 hover:file:bg-gray-100"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-full shadow-lg hover:opacity-90 transition-opacity duration-300"
        >
          Update Profile
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default EntrepreneurProfileForm;
