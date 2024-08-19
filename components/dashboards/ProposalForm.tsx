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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("entrepreneurId", String(entrepreneurId));
    formData.append("category", category);
    formData.append("fundingGoal", String(fundingGoal));
    formData.append("currentFunding", String(currentFunding));
    formData.append("stage", stage);
    formData.append("deadline", deadline);
    formData.append("locationId", String(locationId));
    formData.append("status", status);
    formData.append("presentationDate", presentationDate);

    if (video) formData.append("video", video);
    if (pitchDeck) formData.append("pitchDeck", pitchDeck);
    if (attachments.length > 0) {
      attachments.forEach((file, index) => formData.append(`attachments[${index}]`, file));
    }
    formData.append("tags", JSON.stringify(tags));

    try {
      const response = await fetch("/api/pitch-create", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Proposal submitted successfully!");
      } else {
        throw new Error("Failed to submit proposal");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}
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
      {/* Other fields */}
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
        <label htmlFor="attachments">Attachments:</label>
        <input
          type="file"
          id="attachments"
          name="attachments"
          multiple
          onChange={handleMultiFileChange}
        />
      </div>
      <button type="submit">Submit Proposal</button>
    </form>
  );
};

export default ProposalForm;
