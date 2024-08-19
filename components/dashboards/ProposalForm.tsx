"use client";
import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useUser } from '@clerk/nextjs';

const ProposalForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [entrepreneurId, setEntrepreneurId] = useState<number | undefined>();
  const [feedbacks, setFeedbacks] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [category, setCategory] = useState<string | undefined>();
  const [fundingGoal, setFundingGoal] = useState<number | undefined>();
  const [currentFunding, setCurrentFunding] = useState<number | undefined>();
  const [stage, setStage] = useState<string | undefined>();
  const [video, setVideo] = useState<File | undefined>();
  const [pitchDeck, setPitchDeck] = useState<File | undefined>();
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [locationId, setLocationId] = useState<number | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<string | undefined>();
  const [attachments, setAttachments] = useState<File[]>([]);
  const [presentationDate, setPresentationDate] = useState<Date | undefined>();

  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (entrepreneurId) formData.append('entrepreneurId', entrepreneurId.toString());
    if (category) formData.append('category', category);
    if (fundingGoal) formData.append('fundingGoal', fundingGoal.toString());
    if (currentFunding) formData.append('currentFunding', currentFunding.toString());
    if (stage) formData.append('stage', stage);
    if (video) formData.append('video', video);
    if (pitchDeck) formData.append('pitchDeck', pitchDeck);
    if (deadline) formData.append('deadline', deadline.toISOString());
    if (locationId) formData.append('locationId', locationId.toString());
    formData.append('tags', JSON.stringify(tags));
    if (status) formData.append('status', status);
    attachments.forEach((file, index) => formData.append(`attachments[${index}]`, file));
    if (presentationDate) formData.append('presentationDate', presentationDate.toISOString());

    try {
      await fetch('/api/proposals', {
        method: 'POST',
        body: formData,
      });
      toast.success('Proposal submitted successfully!');
      router.push('/proposals');
    } catch (error) {
      toast.error('Failed to submit proposal.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-100 rounded shadow-md">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          rows={4}
          required
        />
      </div>
      
      <div>
        <label htmlFor="entrepreneurId" className="block text-sm font-medium text-gray-700">Entrepreneur ID</label>
        <input
          type="number"
          id="entrepreneurId"
          value={entrepreneurId}
          onChange={(e) => setEntrepreneurId(Number(e.target.value))}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Add inputs for feedbacks and interests if needed */}
      {/* Add inputs for category, fundingGoal, currentFunding, stage */}

      <div>
        <label htmlFor="video" className="block text-sm font-medium text-gray-700">Video</label>
        <input
          type="file"
          id="video"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files?.[0])}
          className="mt-1 block w-full"
        />
      </div>
      
      <div>
        <label htmlFor="pitchDeck" className="block text-sm font-medium text-gray-700">Pitch Deck</label>
        <input
          type="file"
          id="pitchDeck"
          accept=".pdf,.ppt,.pptx"
          onChange={(e) => setPitchDeck(e.target.files?.[0])}
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
        <input
          type="date"
          id="deadline"
          value={deadline?.toISOString().substring(0, 10)}
          onChange={(e) => setDeadline(new Date(e.target.value))}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="locationId" className="block text-sm font-medium text-gray-700">Location ID</label>
        <input
          type="number"
          id="locationId"
          value={locationId}
          onChange={(e) => setLocationId(Number(e.target.value))}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
        <input
          type="text"
          id="tags"
          value={tags.join(', ')}
          onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <input
          type="text"
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="attachments" className="block text-sm font-medium text-gray-700">Attachments</label>
        <input
          type="file"
          id="attachments"
          multiple
          onChange={(e) => setAttachments(Array.from(e.target.files || []))}
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <label htmlFor="presentationDate" className="block text-sm font-medium text-gray-700">Presentation Date</label>
        <input
          type="date"
          id="presentationDate"
          value={presentationDate?.toISOString().substring(0, 10)}
          onChange={(e) => setPresentationDate(new Date(e.target.value))}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <button type="submit" className="px-4 py-2 bg-gold text-white rounded-md shadow-md hover:bg-gold-dark">Submit</button>
    </form>
  );
};

export default ProposalForm;
