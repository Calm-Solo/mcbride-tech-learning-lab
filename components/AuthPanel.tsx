"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function AuthPanel() {
  return (
    <div className="text-slate-300">
      <SignedOut>
        <p>Sign in or sign up above to track your progress.</p>
      </SignedOut>
      <SignedIn>
        <p className="flex items-center gap-2">
          You&apos;re signed in.
          <UserButton afterSignOutUrl="/" />
        </p>
      </SignedIn>
    </div>
  );
}
