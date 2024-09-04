"use client";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "@/components/Loader";

export default function ReceiveFriendRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await fetch('/api/received-friend-requests');
        if (response.ok) {
          const data = await response.json();
          setRequests(data.requests);
        } else {
          toast.error('Failed to fetch received friend requests.');
        }
      } catch (error) {
        console.error('Failed to fetch received friend requests', error);
        toast.error('Failed to fetch received friend requests.');
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="relative min-h-screen">
      <main className="flex flex-col items-center justify-center w-full h-full px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Received Friend Requests</h1>
        <ul className="w-full max-w-2xl">
          {requests.map(request => (
            <li key={request.id} className="border p-4 mb-2 rounded-lg">
              <p className="font-semibold">{request.senderName}</p>
              <p>Status: {request.status}</p>
              <a href={`/friendrequests/${request.id}/send`} className="text-blue-500 hover:underline">Respond</a>
            </li>
          ))}
        </ul>
        <ToastContainer />
      </main>
    </div>
  );
}
