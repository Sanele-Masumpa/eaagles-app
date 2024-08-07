'use client';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '@clerk/nextjs';
import addRole from '@/app/actions/addRole'; // Update the path as needed

const SelectRole = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { user } = useUser();

  const handleRoleAssignment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const roleName = formData.get('role') as 'INVESTOR' | 'ENTREPRENEUR';

    if (!roleName) {
      toast.error('Role is required');
      return;
    }

    if (window.confirm(`Do you want to save ${roleName} as your role? This cannot be changed.`)) {
      const { data, error } = await addRole({
        role: roleName,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        clerkId: user.id,
        imageUrl: user.profileImageUrl
      });

      if (error) {
        toast.error(error);
      } else {
        toast.success(`Role ${data?.role} assigned`);
        formRef.current?.reset();
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
};

export default SelectRole;
