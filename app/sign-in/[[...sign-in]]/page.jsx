import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      {/* Existing sign-in form or content goes here */}
      {/* ...existing code... */}
      <SignIn/>
    </div>
  );
}