"use client";

import { ChangeEvent, FormEvent, useState } from "react";

interface ProposalFormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const ProposalForm: React.FC<ProposalFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [entrepreneurId, setEntrepreneurId] = useState<number | "">("");
  const [category, setCategory] = useState<string | "">("");
  const [fundingGoal, setFundingGoal] = useState<number | "">("");
  const [currentFunding, setCurrentFunding] = useState<number | "">("");
  const [stage, setStage] = useState<string | "">("");
  const [video, setVideo] = useState<File | null>(null);
  const [pitchDeck, setPitchDeck] = useState<File | null>(null);
  const [deadline, setDeadline] = useState<string | "">("");
  const [locationId, setLocationId] = useState<number | "">("");
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<string | "">("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [presentationDate, setPresentationDate] = useState<string | "">("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files.length > 0) {
      setter(e.target.files[0]);
    }
  };

  const handleMultiFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value.split(",").map(tag => tag.trim()));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="entrepreneurId">Entrepreneur ID:</label>
        <input
          type="number"
          id="entrepreneurId"
          name="entrepreneurId"
          value={entrepreneurId}
          onChange={(e) => setEntrepreneurId(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label htmlFor="category">Category:</label>
        <input
          type="text"
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="fundingGoal">Funding Goal:</label>
        <input
          type="number"
          id="fundingGoal"
          name="fundingGoal"
          value={fundingGoal}
          onChange={(e) => setFundingGoal(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="currentFunding">Current Funding:</label>
        <input
          type="number"
          id="currentFunding"
          name="currentFunding"
          value={currentFunding}
          onChange={(e) => setCurrentFunding(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="stage">Stage:</label>
        <input
          type="text"
          id="stage"
          name="stage"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="video">Video:</label>
        <input
          type="file"
          id="video"
          name="video"
          accept="video/*"
          onChange={(e) => handleFileChange(e, setVideo)}
        />
      </div>
      <div>
        <label htmlFor="pitchDeck">Pitch Deck:</label>
        <input
          type="file"
          id="pitchDeck"
          name="pitchDeck"
          accept=".pdf,.pptx"
          onChange={(e) => handleFileChange(e, setPitchDeck)}
        />
      </div>
      <div>
        <label htmlFor="deadline">Deadline:</label>
        <input
          type="date"
          id="deadline"
          name="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="locationId">Location ID:</label>
        <input
          type="number"
          id="locationId"
          name="locationId"
          value={locationId}
          onChange={(e) => setLocationId(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="tags">Tags (comma-separated):</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={tags.join(", ")}
          onChange={handleTagsChange}
        />
      </div>
      <div>
        <label htmlFor="status">Status:</label>
        <input
          type="text"
          id="status"
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="attachments">Attachments:</label>
        <input
          type="file"
          id="attachments"
          name="attachments"
          multiple
          onChange={handleMultiFileChange}
        />
      </div>
      <div>
        <label htmlFor="presentationDate">Presentation Date:</label>
        <input
          type="date"
          id="presentationDate"
          name="presentationDate"
          value={presentationDate}
          onChange={(e) => setPresentationDate(e.target.value)}
        />
      </div>
      <button type="submit">Submit Proposal</button>
    </form>
  );
};

export default ProposalForm;
