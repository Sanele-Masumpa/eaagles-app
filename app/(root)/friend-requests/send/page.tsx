"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SendFriendRequestPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSendRequest = async () => {
    try {
      const response = await fetch('/api/send-friend-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        toast.success('Friend request sent successfully!');
        router.push('/friendrequests');
      } else {
        toast.error('Failed to send friend request.');
      }
    } catch (error) {
      console.error('Failed to send friend request', error);
      toast.error('Failed to send friend request.');
    }
  };

  return (
    <div className="relative min-h-screen">
      <main className="flex flex-col items-center justify-center w-full h-full px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Send Friend Request</h1>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-4 rounded-lg w-full max-w-md"
        />
        <button onClick={handleSendRequest} className="bg-blue-500 text-white p-2 rounded-lg">Send Request</button>
        <ToastContainer />
      </main>
    </div>
  );
}
