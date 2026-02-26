"use client";

import { SignIn, SignUp, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Section from "@/components/Section";

type Tab = "signin" | "signup";

export default function AuthPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("signin");

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/");
    }
  }, [isSignedIn, router]);

  if (isSignedIn) {
    return null;
  }

  return (
    <main className="relative min-h-screen text-slate-100">
      <Header />
      <Section className="pt-24 pb-16">
        <div className="max-w-xl mx-auto bg-white/5 border border-white/10 backdrop-blur rounded-2xl shadow-xl p-10">
          <div className="flex gap-4 mb-6 border-b border-white/10">
            <button
              type="button"
              onClick={() => setTab("signin")}
              className={`pb-3 px-1 font-semibold transition-colors ${
                tab === "signin"
                  ? "text-cyan-300 border-b-2 border-cyan-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setTab("signup")}
              className={`pb-3 px-1 font-semibold transition-colors ${
                tab === "signup"
                  ? "text-cyan-300 border-b-2 border-cyan-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sign up
            </button>
          </div>
          {tab === "signin" ? (
            <SignIn
              signUpUrl="/auth"
              forceRedirectUrl="/"
              appearance={{
                variables: { colorPrimary: "#06b6d4" },
              }}
            />
          ) : (
            <SignUp
              signInUrl="/auth"
              forceRedirectUrl="/"
              appearance={{
                variables: { colorPrimary: "#06b6d4" },
              }}
            />
          )}
        </div>
      </Section>
    </main>
  );
}
