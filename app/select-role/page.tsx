'use client';

import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function SelectRole() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleRoleAssignment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const roleName = formData.get('role') as 'INVESTOR' | 'ENTREPRENEUR';

    if (!roleName) {
      toast.error('Role is required');
      return;
    }

    if (window.confirm(`Do you want to save ${roleName} as your role? This cannot be changed.`)) {
      try {
        const response = await fetch('/api/assign-role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role: roleName }),
        });

        if (response.ok) {
          const data = await response.json();
          toast.success(data.message);
          formRef.current?.reset();
          router.push('/success'); // Redirect to a success page or reload
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || 'Failed to assign role');
        }
      } catch (error) {
        toast.error('Failed to assign role');
        console.error(error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 p-6 bg-white rounded-xl shadow-md space-y-4">
      <h3 className="text-2xl font-bold text-gray-800">Select Role</h3>
      <form ref={formRef} onSubmit={handleRoleAssignment}>
        <div className="relative">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            id="role"
            name="role"
          >
            <option value="">Select role</option>
            <option value="INVESTOR">Investor</option>
            <option value="ENTREPRENEUR">Entrepreneur</option>
          </select>
        </div>
        <button
          className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          type="submit"
        >
          Assign Role
        </button>
      </form>
    </div>
  );
}
