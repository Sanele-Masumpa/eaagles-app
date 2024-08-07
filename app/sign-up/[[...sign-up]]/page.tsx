import { SignUp } from '@clerk/nextjs';

export default function SiginInPage() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <div className="clerk-wrapper">
        <SignUp />
      </div>
    </main>
  );
}