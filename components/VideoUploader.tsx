import { useState } from 'react';
import { Uppy } from '@uppy/core';
import Dashboard from '@uppy/react/lib/Dashboard';
import Tus from '@uppy/tus';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader'; // Assuming you have a Loader component for screen loading
import LoadingDots from '@/components/ui/LoadingDots'; // For button loading if needed

const VideoUploader = () => {
  const [uploading, setUploading] = useState(false);
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  // Initialize Uppy instance with restrictions
  const uppy = new Uppy({
    restrictions: { maxFileSize: MAX_FILE_SIZE, allowedFileTypes: ['video/*'] },
    autoProceed: true,
  }).use(Tus, {
    endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
    headers: {
      authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
  });

  // Handle the upload event
  uppy.on('upload', () => {
    setUploading(true);
  });

  // Handle the complete event
  uppy.on('complete', (result) => {
    setUploading(false);
    const successfulUploads = result.successful ?? []; // Default to empty array if undefined
    if (successfulUploads.length > 0) {
      toast.success('Video uploaded successfully!');
    } else {
      toast.error('Failed to upload video.');
    }
  });

  // Handle restriction failures (e.g., file too large)
  uppy.on('restriction-failed', (file) => {
    toast.error('File is too large! Please upload a file smaller than 50MB.');
  });

  return (
    <div className="my-8">
      {uploading && <Loader />}
      <Dashboard uppy={uppy} proudlyDisplayPoweredByUppy={false} />
    </div>
  );
};

export default VideoUploader;
