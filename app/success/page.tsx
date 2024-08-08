import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { title } from "@/components/primitives";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect after a few seconds
    const timer = setTimeout(() => {
      router.push('/'); // Redirect to home or another page after a delay
    }, 3000); // Adjust the delay as needed

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [router]);

  return (
    <div className="max-w-full px-6 py-8 mx-auto flex items-center justify-center min-h-screen">
      <div className="text-center p-8 bg-white rounded-lg shadow-md space-y-4">
        <svg
          className="mx-auto h-16 w-16 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h1 className={`${title()} text-center mb-4 text-3xl font-bold text-gray-900`}>
          Success!
        </h1>
        <p className="text-gray-600 mb-4">
          Your role has been successfully assigned. You will be redirected shortly.
        </p>
        <a
          href="/"
          className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
}
