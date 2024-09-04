"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "@/components/Loader";

export default function RespondFriendRequestPage({ params }: { params: { id: string } }) {
  const [request, setRequest] = useState<any>(null);
  const [status, setStatus] = useState("PENDING");
  const router = useRouter();

  useEffect(() => {
    async function fetchRequest() {
      try {
        const response = await fetch(`/api/friend-request/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setRequest(data.request);
        } else {
          toast.error('Failed to fetch friend request details.');
        }
      } catch (error) {
        console.error('Failed to fetch friend request details', error);
        toast.error('Failed to fetch friend request details.');
      }
    }

    fetchRequest();
  }, [params.id]);

  const handleRespond = async () => {
    try {
      const response = await fetch(`/api/respond-friend-request/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        toast.success('Friend request response sent successfully!');
        router.push('/friendrequests/receive');
      } else {
        toast.error('Failed to respond to friend request.');
      }
    } catch (error) {
      console.error('Failed to respond to friend request', error);
      toast.error('Failed to respond to friend request.');
    }
  };

  if (!request) {
    return <Loader />;
  }

  return (
    <div className="relative min-h-screen">
      <main className="flex flex-col items-center justify-center w-full h-full px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Respond to Friend Request</h1>
        <p className="mb-4">From: {request.senderName}</p>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2 mb-4 rounded-lg">
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accept</option>
          <option value="REJECTED">Reject</option>
        </select>
        <button onClick={handleRespond} className="bg-blue-500 text-white p-2 rounded-lg">Submit Response</button>
        <ToastContainer />
      </main>
    </div>
  );
}
